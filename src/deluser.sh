#!/bin/bash

deluser $1

umount /home/$1
rm -r /home/$1
rm /media/users/$1.img
