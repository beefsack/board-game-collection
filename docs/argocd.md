# ArgoCD Deployment Guide

One-time setup for deploying to Linode Kubernetes Engine (LKE) via GitOps.

## Prerequisites

- `kubectl` configured against your LKE cluster (`kubectl cluster-info` should succeed)
- `openssl` available locally

---

## 1. Install the nginx Ingress Controller

LKE does not ship with an ingress controller. Install the official nginx ingress controller, which provisions a Linode NodeBalancer automatically:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0/deploy/static/provider/cloud/deploy.yaml
```

> Check the [ingress-nginx releases](https://github.com/kubernetes/ingress-nginx/releases) for the latest stable version.

Wait for the controller pod to be ready:

```bash
kubectl rollout status deployment ingress-nginx-controller -n ingress-nginx
```

---

## 2. Install ArgoCD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl rollout status deployment argocd-server -n argocd
```

### Access the UI

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Retrieve the initial admin password:

```bash
kubectl get secret argocd-initial-admin-secret -n argocd \
  -o jsonpath='{.data.password}' | base64 -d
```

Log in at `https://localhost:8080` with username `admin` and the password above.

---

## 3. Create Secrets

These secrets must exist in the cluster before ArgoCD syncs for the first time. They are never committed to the repository.

### Postgres credentials

```bash
kubectl create namespace board-game-collection

kubectl create secret generic postgres-credentials \
  --from-literal=username=board_game_collection \
  --from-literal=password=<choose-a-strong-password> \
  -n board-game-collection
```

### MinIO credentials

```bash
kubectl create secret generic minio-credentials \
  --from-literal=root-user=<choose-a-username> \
  --from-literal=root-password=<choose-a-strong-password> \
  -n board-game-collection
```

### JWT RSA key

Generate a 2048-bit RSA private key in PKCS8 PEM format, store it as a secret, then delete the local file:

```bash
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out jwt-private.pem

kubectl create secret generic jwt-rsa-key \
  --from-literal=private-key="$(cat jwt-private.pem)" \
  -n board-game-collection

rm jwt-private.pem
```

---

## 4. Create the ArgoCD Application

Apply this manifest to register the application with ArgoCD:

```bash
kubectl apply -f - <<EOF
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: board-game-collection
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/beefsack/board-game-collection
    targetRevision: main
    path: k8s/overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: board-game-collection
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
EOF
```

`automated` sync means ArgoCD polls the repository every 3 minutes and applies any changes automatically. The CI pipeline also triggers an immediate sync by updating the image tags on every push to `main`.

---

## 5. Verify

```bash
# All pods running
kubectl get pods -n board-game-collection

# Ingress has an external IP (the Linode NodeBalancer address)
kubectl get ingress -n board-game-collection

# ArgoCD shows the application as Healthy + Synced
kubectl get application board-game-collection -n argocd
```

Once the ingress shows an external IP, the application is reachable at that address.
