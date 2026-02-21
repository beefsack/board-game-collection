{ pkgs, config, ... }:

{
  languages.java = {
    enable = true;
    gradle.enable = true;
  };

  languages.kotlin = {
    enable = true;
  };

  languages.javascript = {
    enable = true;
    npm.enable = true;
  };

  packages = [
    pkgs.jetbrains.idea-oss
    pkgs.chromium
    pkgs.act
    pkgs.gh
  ];

  env = {
    CHROMIUM_PATH = "${pkgs.chromium}/bin/chromium";
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1";
  };
}
