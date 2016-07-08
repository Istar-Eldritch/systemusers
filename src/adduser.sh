#!/bin/bash

if id "$1" >/dev/null 2>&1; then
  echo "user $1 exists"
else
  mkdir -p /media/users
  dd if=/dev/zero of=/media/users/$1.img bs=512K count=1000
  mkfs.ext4 -F /media/users/$1.img
  mkdir /home/$1
  mount -o loop /media/users/$1.img /home/$1
  chown -R $1 /home/$1

  useradd -M -d /home/$1 -s /usr/bin/fish -p biohack $1
  echo $1:biohack | chpasswd
  chage -d 0 $1
fi
