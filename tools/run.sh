#!/usr/bin/env bash
#
# Run jekyll serve and then launch the site

prod=false
command=""
host="127.0.0.1"
ruby_bin="ruby"

help() {
  echo "Usage:"
  echo
  echo "   bash /path/to/run [options]"
  echo
  echo "Options:"
  echo "     -H, --host [HOST]    Host to bind to."
  echo "     -p, --production     Run Jekyll in 'production' mode."
  echo "     -h, --help           Print this help information."
}

while (($#)); do
  opt="$1"
  case $opt in
  -H | --host)
    host="$2"
    shift 2
    ;;
  -p | --production)
    prod=true
    shift
    ;;
  -h | --help)
    help
    exit 0
    ;;
  *)
    echo -e "> Unknown option: '$opt'\n"
    help
    exit 1
    ;;
  esac
done

if ! command -v "$ruby_bin" >/dev/null 2>&1; then
  if command -v ruby.exe >/dev/null 2>&1; then
    ruby_bin="ruby.exe"
  else
    echo "> Ruby not found in PATH"
    exit 1
  fi
fi

command="$ruby_bin -S jekyll s -l"
command="$command -H $host"

if $prod; then
  command="JEKYLL_ENV=production $command"
fi

if [ -e /proc/1/cgroup ] && grep -q docker /proc/1/cgroup; then
  command="$command --force_polling"
fi

echo -e "\n> $command\n"
eval "$command"
