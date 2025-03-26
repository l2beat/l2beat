export PATH="$(pwd)/node_modules/.bin:$PATH"
export PATH="$(pwd)/../../node_modules/.bin:$PATH"

tailwindcss \
  -i src/styles/globals.css \
  -o ./static/index.css \
  --watch < /dev/tty &

wait
