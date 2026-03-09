#!/usr/bin/env bash
#
# Build and test the site content
#
# Requirement: html-proofer, jekyll
#
# Usage: See help information

set -eu

SITE_DIR="_site"

_config="_config.yml"

_baseurl=""
_ruby_bin="ruby"
_skip_htmlproofer="${SKIP_HTMLPROOFER:-0}"

help() {
  echo "Build and test the site content"
  echo
  echo "Usage:"
  echo
  echo "   bash $0 [options]"
  echo
  echo "Options:"
  echo '     -c, --config   "<config_a[,config_b[...]]>"    Specify config file(s)'
  echo "     -h, --help               Print this information."
}

read_baseurl() {
  if [[ $_config == *","* ]]; then
    # multiple config
    IFS=","
    read -ra config_array <<<"$_config"

    # reverse loop the config files
    for ((i = ${#config_array[@]} - 1; i >= 0; i--)); do
      _tmp_baseurl="$(grep '^baseurl:' "${config_array[i]}" | sed "s/.*: *//;s/['\"]//g;s/#.*//" | tr -d '\r')"

      if [[ -n $_tmp_baseurl ]]; then
        _baseurl="$_tmp_baseurl"
        break
      fi
    done

  else
    # single config
    _baseurl="$(grep '^baseurl:' "$_config" | sed "s/.*: *//;s/['\"]//g;s/#.*//" | tr -d '\r')"
  fi
}

main() {
  if ! command -v "$_ruby_bin" >/dev/null 2>&1; then
    if command -v ruby.exe >/dev/null 2>&1; then
      _ruby_bin="ruby.exe"
    else
      echo "Ruby not found in PATH"
      exit 1
    fi
  fi

  # clean up
  if [[ -d $SITE_DIR ]]; then
    rm -rf "$SITE_DIR"
  fi

  read_baseurl

  # build
  JEKYLL_ENV=production "$_ruby_bin" -S jekyll b \
    -d "$SITE_DIR$_baseurl" -c "$_config"

  if [[ $_skip_htmlproofer == "1" ]]; then
    echo "SKIP_HTMLPROOFER=1, skip link checking"
    return 0
  fi

  # link test
  if "$_ruby_bin" -S htmlproofer --version >/dev/null 2>&1; then
    "$_ruby_bin" -S htmlproofer "$SITE_DIR$_baseurl" \
      --disable-external \
      --ignore-urls "/^http:\/\/127.0.0.1/,/^http:\/\/0.0.0.0/,/^http:\/\/localhost/"
  else
    echo "htmlproofer not found."
    echo "Fix with: bundle config unset without && bundle install"
    echo "Or skip once: SKIP_HTMLPROOFER=1 bash tools/test.sh"
    exit 1
  fi
}

while (($#)); do
  opt="$1"
  case $opt in
  -c | --config)
    _config="$2"
    shift
    shift
    ;;
  -h | --help)
    help
    exit 0
    ;;
  *)
    # unknown option
    help
    exit 1
    ;;
  esac
done

main
