---
layout: post-layout.njk
title: Kafka without Zookeeper with TDP
date: 2022-08-09
tags: ['post']
---
<!-- Excerpt Start -->
超越自我!
<!-- Excerpt End -->


### Environment
1. JDK 11 or 17 required
2. TDP installed

## Steps

1. Package Kafka
```bash
~/work/package-kafka.sh -v 3.2.1 -o unix -w "邱张华"
```

```bash
#!/usr/bin/env sh

# ~/work/package-kafka.sh -v 3.2.1 -o windows -w "邱张华"
# ~/work/package-kafka.sh -v 3.2.1 -o unix -w "邱张华"

# Usage under *nix
# start-kafka3.sh

while getopts "v:w:o:" arg
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


cd ~/work
mkdir -p ~/work/origin/kafka
cd  ~/work/origin/kafka

zipFile="kafka_2.13-${version}.tgz"

[ ! -f "${zipFile}" ] && wget https://downloads.apache.org/kafka/"${version}"/kafka_2.13-"${version}".tgz
rm -rf ~/work/tmp
mkdir -p ~/work/tmp
cd ~/work/tmp

tar xvf ~/work/origin/kafka/"${zipFile}"

mv kafka_2.13-"${version}" kafka_"${version}"_"${os}"
cd kafka_"${version}"_"${os}"


if [ "${os}" = "windows" ];
then
echo """name: kafka
version: ${version}
author: ${writer}
env:
   KAFKA_HOME: \"%PLUGIN_HOME%\"
   PATH: \"%KAFKA_HOME%\\\\bin\\\\windows;%PATH%\"
""" >tdp_plugin.yaml
else
echo """name: kafka
version: ${version}
author: ${writer}
env:
   KAFKA_HOME: \${PLUGIN_HOME}
   PATH: \${KAFKA_HOME}/bin:\${PATH}
""" > tdp_plugin.yaml
fi


cd ~/work/tmp

zip -q kafka_"${version}"_"${os}".zip -r -y kafka_"${version}"_"${os}"/

mkdir -p ~/work/plugin

cp kafka_"${version}"_"${os}".zip ~/work/plugin
```

2. Install Kafka
```bash
tdp install plugin/kafka_3.2.1_unix.zip 
```

3. Create Kafka( Run ONLY once!!! or you'll lost your data!!)
```bash
~/work/create-kafka3.sh
```

```bash
#!/usr/bin/env sh

# run create-kafka3.sh Only once!!!

command="kafka-storage.sh random-uuid"
uuid=`$command`
echo $uuid > ${TDP_HOME}/data/kafka/uuid.txt

for number in {1..6}
do
  printf -v sn "%02d" $number
  mkdir -p ${TDP_HOME}/data/kafka/log$sn
  port=$((9091+$number))
  cd ${TDP_HOME}/data/kafka
  cp $KAFKA_HOME/config/kraft/server.properties server$sn.properties
  x="$(cd "${TDP_HOME}/data/kafka/log$sn" && pwd)"
  printf "
node.id=$sn
listeners=PLAINTEXT://:$port,CONTROLLER://:1$port
log.dirs=/Users/daniel/tdp/data/kafka/log$x
controller.quorum.voters=01@localhost:19092,02@localhost:19093,03@localhost:19094,04@localhost:19095,05@localhost:19096,06@localhost:19097
" >> server$sn.properties

kafka-storage.sh format -t $uuid -c server$sn.properties
done
```
4. Start Kafka
```bash
~/work/start-kafka3.sh
```

```bash
#!/usr/bin/env sh

for number in {1..6}
do
  printf -v sn "%02d" $number
  nohup kafka-server-start.sh -daemon $TDP_HOME/data/kafka/server${sn}.properties
done

# kafka-topics.sh --create --topic my-kafka-topic --bootstrap-server localhost:9092 --partitions 6 --replication-factor 2
# kafka-topics.sh --list --bootstrap-server localhost:9092
# kafka-topics.sh --describe --topic my-kafka-topic --bootstrap-server localhost:9092
```

5. Stop Kafka
```bash
kafka-server-stop.sh
```
