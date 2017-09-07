#!/bin/bash
echo "Starting Replication Controllers"
kubectl create -f moximo-mariadb-rc.json
kubectl create -f moximo-nginx-rc.json 
kubectl create -f moximo-fpm-rc.json 
kubectl create -f moximo-nginx-service.json

