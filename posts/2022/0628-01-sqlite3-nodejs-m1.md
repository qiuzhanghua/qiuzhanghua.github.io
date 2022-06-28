---
layout: post-layout.njk
title: Install sqlite3 for Node.js under Mac M1
date: 2022-06-28
tags: ['post']
---
<!-- Excerpt Start -->
Keep trying!
<!-- Excerpt End -->


### Environment
1. Mac M1 Max
2. Monterey
3. Node v16.15.1
4. pnpm v7.3.0

## Steps

1. First of all
```bash
# Don't activate conda !!!
```

2. Install sqlite3
```bash
brew install sqlite3
```

3. Export env
```bash
export PATH="/opt/homebrew/opt/sqlite/bin:$PATH"
export LDFLAGS="-L/opt/homebrew/opt/sqlite/lib"
export CPPFLAGS="-I/opt/homebrew/opt/sqlite/include"
export PKG_CONFIG_PATH="/opt/homebrew/opt/sqlite/lib/pkgconfig"
```

4. Under your project
```bash
pnpm add sqlite3
# node_modules/.pnpm/sqlite3@5.0.8/node_modules/sqlite3: Running install script, done in 1m 41s
```

5. Check
```bash
node -e "var sqlite3=require('sqlite3'); console.log(sqlite3.VERSION)"
```
3.38.4