---
layout: post-layout.njk
title: Use pnpm offline
date: 2022-06-25
tags: ['post']
---
<!-- Excerpt Start -->
三思而后行
<!-- Excerpt End -->

## 前提条件
Node.js已经安装
(TDP 已经安装)
pnpm 已经安装


## 制作离线包
Computer online

Make working directory
```bash
rm -rf ~/offline
mkdir ~/offline

export XDG_DATA_HOME=~/offline/repo
export XDG_CACHE_HOME=~/offline/cache
export XDG_STATE_HOME=~/offline/state
```

```bash
# under your working space
mkdir hello
cd hello
pnpm init

```

Add some dependency
```bash
pnpm add -D esbuild
pnpm add -D tailwindcss
pnpm add express
```

Zip it
```bash
cd ~/offline
zip -r pnp-offline.zip .
```

## 离线如何使用
On Computer offline
```bash
cd  ~/tdp
unzip -o pnp-offline.zip
# 只需运行一次
```

### 日常工作
```bash
mkdir xxx
cd xxx
pnpm init
pnpm add -D tailwindcss --offline
pnpm add express --offline

...

```

or
```bash
pnpm i --offline
```
