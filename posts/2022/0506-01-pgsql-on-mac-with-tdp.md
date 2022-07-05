---
layout: post-layout.njk
title: pgsql on Mac with TDP
date: 2022-05-06
tags: ['post']
---
<!-- Excerpt Start -->
一切皆有可能
<!-- Excerpt End -->

## 日常使用
```bash
# initdb -U postgres -W
pg_ctl -D $TDP_HOME/data/pgsql/14.4-1 -l $TDP_HOME/log/pgsql/14.4-1/logfile start
# createuser app -U postgres -P
# createdb app -U postgres -O app -E UTF8 -e
# psql -U app -d app -h 127.0.0.1
pg_ctl stop
```
## 安装
```bash
# ~/work/package-pgsql.sh -v 14.2-2 -o windows -w "邱张华"
~/work/package-pgsql.sh -v 14.2-2 -o osx -w "邱张华"
```
## 脚本
```bash
#!/usr/bin/env bash
while getopts "v:o:w:" arg
do case $arg in

  v)
    version="$OPTARG"
    ;;
  w)
    writer="$OPTARG"
    ;;
  o)
    os="$OPTARG"
    ;;
  ?)
    echo "unknown argument"
    exit 1
    ;;
  esac
done


os2=$os
if [ "$os" = "osx" ];then
	os2="darwin"
fi

if [ "$os" = "win" ];then
   os2="windows"
fi

cd ~/work
mkdir -p ~/work/origin/pgsql
cd  ~/work/origin/pgsql

if [ "$os2" = "windows" ];then
   zipfile="postgresql-${version}-windows-x64-binaries.zip"
	download_url="https://get.enterprisedb.com/postgresql/postgresql-${version}-windows-x64-binaries.zip"
else
   zipfile="postgresql-${version}-osx-binaries.zip"
   download_url="https://get.enterprisedb.com/postgresql/postgresql-${version}-osx-binaries.zip"
fi

[ ! -f "${zipfile}" ] && wget --no-check-certificate $download_url

rm -rf ~/work/tmp
mkdir -p ~/work/tmp
cd ~/work/tmp

unzip -q ~/work/origin/pgsql/${zipfile}


mv pgsql pgsql_${version}_${os2}
cd pgsql_${version}_${os2}


if [ "$os2" = "windows" ];
then
echo """name: pgsql
version: ${version}
author: ${writer}
once: 
- \"cmd /C if not exist %TDP_HOME%\\\\data\\\\pgsql\\\\${version} mkdir %TDP_HOME%\\\\data\\\\pgsql\\\\${version}\"
- \"cmd /C if not exist %TDP_HOME%\\\\log\\\\pgsql\\\\${version} mkdir %TDP_HOME%\\\\log\\\\pgsql\\\\${version}\"
env:
   PGSQL_HOME: \"%PLUGIN_HOME%\"
   PGDATA: \"\%TDP_HOME%\\\\data\\\\pgsql\\\\${version}\"
   PATH: \"%PGSQL_HOME%\\\\bin;%PATH%\"
""" >tdp_plugin.yaml

else
echo """name: pgsql
version: ${version}
author: ${writer}
once: 
- \"mkdir -p \${TDP_HOME}/data/pgsql/${version}\"
- \"mkdir -p \${TDP_HOME}/log/pgsql/${version}\"
env:
   PGSQL_HOME: \${PLUGIN_HOME}
   PGDATA: \${TDP_HOME}/data/pgsql/${version}
   PATH: \${PGSQL_HOME}/bin:\${PATH}
""" > tdp_plugin.yaml
fi

cd ~/work/tmp

zip pgsql_${version}_${os2}.zip -r -y pgsql_${version}_${os2}/

mkdir -p ~/work/plugin

cp pgsql_${version}_${os2}.zip ~/work/plugin

```