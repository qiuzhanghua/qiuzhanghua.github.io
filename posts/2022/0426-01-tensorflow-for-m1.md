---
layout: post-layout.njk
title: TensorFlow for M1
date: 2022-04-26
tags: ['post']
---
<!-- Excerpt Start -->
尽心尽力
<!-- Excerpt End -->

## 安装脚本

```bash
conda create --name tf25 python=3.8

conda activate tf25

conda install -c apple tensorflow-deps

pip install tensorflow-macos

pip install tensorflow-metal

pip install jupyterlab
```

## 使用

```python
import tensorflow as tf

print(tf.config.list_physical_devices())

print(tf.__version__)

with tf.device('/device:GPU:0'):
  a = tf.constant([1.0, 2.0, 3.0, 4.0, 5.0, 6.0], shape=[2, 3], name='a')
  b = tf.constant([1.0, 2.0, 3.0, 4.0, 5.0, 6.0], shape=[3, 2], name='b')
  c = tf.matmul(a, b)

print(c)
```

## 参考资料
https://www.mrdbourke.com/setup-apple-m1-pro-and-m1-max-for-machine-learning-and-data-science/
