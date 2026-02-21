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
  };

  packages = [
    pkgs.jetbrains.idea-oss
  ];
}

