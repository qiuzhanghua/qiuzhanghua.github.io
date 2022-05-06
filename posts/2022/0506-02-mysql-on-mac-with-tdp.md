---
layout: post-layout.njk
title: MySQL on Mac with TDP
date: 2022-05-06
tags: ['post']
---
<!-- Excerpt Start -->
至诚至坚
<!-- Excerpt End -->

## 启用/停止
```bash
mysqld &

mysqladmin -u root shutdown
```

## 初始化SQL
```sql
create database app default character set utf8mb4 collate utf8mb4_unicode_ci;
create user app identified by 'app';
grant all privileges on app.* to 'app'@'%' with grant option;
flush privileges;
```

## 安装
```bash
~/work/package-mysql.sh -v 8.0.29 -o macosx -a arm64 -w "邱张华"
```
## 脚本
```bash
#!/usr/bin/env bash

# ~/work/package-mysql.sh -v 8.0.29 -o macosx -a arm64 -w "邱张华"

while getopts "v:o:a:w:z:" arg
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
  a)
    arch="$OPTARG"
    ;;   
  ?)
    echo "unknown argument"
    exit 1
    ;;
  esac
done


os2=$os
if [ "$os" = "macosx" ];then
	os2="darwin"
fi

if [ "$os" = "win" ];then
   os2="windows"
fi

arch2=$arch
arch_url=$arch
echo $os
if [[ "$os" != "win" && "$arch" == "x64" ]];then
	arch_url="x86_64"
fi

if [ "$arch" = "x64" ];then
	arch2="amd64"
fi
if [ "$arch" = "aarch64" ];then
   arch2="arm64"
fi

if [ "$arch" = "i686" ];then
   arch2="386"
fi

conf_path=`pwd`/conf
major_version=${version:0:3}

cd ~/work
mkdir -p ~/work/origin/mysql
cd  ~/work/origin/mysql


if [ "$os2" = "windows" ];then
	mysql_dir=mysql-${version}-win${arch_url}
	mysql_package="mysql-${version}-win${arch_url}.zip"
	download_url="https://mirrors.tuna.tsinghua.edu.cn/mysql/downloads/MySQL-${major_version}/mysql-${version}-win${arch_url}.zip"
elif [ "$os" = "macosx" ];then
	mysql_dir=mysql-${version}-macos12-${arch_url}
	mysql_package="mysql-${version}-macos12-${arch_url}.tar.gz"
	download_url="https://mirrors.tuna.tsinghua.edu.cn/mysql/downloads/MySQL-${major_version}/mysql-${version}-macos12-${arch_url}.tar.gz"
else
	mysql_dir=mysql-${version}-linux-glibc2.12-${arch_url}
	mysql_package="mysql-${version}-linux-glibc2.12-${arch_url}.tar"
	download_url="https://mirrors.tuna.tsinghua.edu.cn/mysql/downloads/MySQL-${major_version}/mysql-${version}-linux-glibc2.12-${arch_url}.tar"
fi

echo $download_url
echo $mysql_package

[ ! -f "${mysql_package}" ] && wget --no-check-certificate $download_url

rm -rf ~/work/tmp
mkdir -p ~/work/tmp
cd ~/work/tmp

if [ "$os2" = "windows" ];then
   unzip ~/work/origin/mysql/${mysql_package}
elif [ "$os2" = "darwin" ];then
   tar -xvf ~/work/origin/mysql/${mysql_package}
else
   tar -xvf ~/work/origin/mysql/${mysql_package}
   xz -d ./mysql-${version}-linux-glibc2.12-${arch_url}.tar.xz
   tar -xvf ./mysql-${version}-linux-glibc2.12-${arch_url}.tar
fi


mv ${mysql_dir}  mysql_${version}_${os2}_${arch2}
cd  mysql_${version}_${os2}_${arch2}


if [ "$os2" = "windows" ];
then
echo """name: mysql
version: ${version}
author: ${writer}
once: 
- \"cmd /C if not exist %TDP_HOME%\\\\data\\\\mysql\\\\${version} mkdir %TDP_HOME%\\\\data\\\\mysql\\\\${version}\"
- \"tiny-replace %MYSQL_HOME%/my.ini\"
- \"%MYSQL_HOME%\\\\bin\\\\mysqld --initialize-insecure\"
env:
   MYSQL_HOME: \"%PLUGIN_HOME%\"
   MYSQL_VERSION: ${version}
   PATH: \"%MYSQL_HOME%\\\\bin;%PATH%\"
""" >tdp_plugin.yaml

cp $conf_path/mysql_windows/my.ini ./

else
echo """name: mysql
version: ${version}
author: ${writer}
once: 
- \"mkdir -p \${TDP_HOME}/data/mysql/${version}\"
- \"tiny-replace \${MYSQL_HOME}/my.cnf\"
- \"\${MYSQL_HOME}/bin/mysqld --initialize-insecure\"
env:
   MYSQL_HOME: \${PLUGIN_HOME}
   MYSQL_VERSION: ${version}
   CURRENT_USER: \${USER}
   PATH: \${MYSQL_HOME}/bin:\${PATH}
""" > tdp_plugin.yaml

cp $conf_path/mysql_linux/my.cnf ./
fi

cd ~/work/tmp

zip -q mysql_${version}_${os2}_${arch2}.zip -r -y mysql_${version}_${os2}_${arch2}/

mkdir -p ~/work/plugin

if [ -f ~/work/plugin/mysql_${version}_${os2}_${arch2}.zip ];then
 rm -f ~/work/plugin/mysql_${version}_${os2}_${arch2}.zip
fi

cp mysql_${version}_${os2}_${arch2}.zip ~/work/plugin
```