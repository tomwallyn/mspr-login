#!/bin/bash
for i in {1..102}
do
  curl -k -s -o /dev/null -w "%{http_code}\n" -X POST -d 'username=user@mspr.com' -d 'password=Azerty1234' https://localhost:4000/auth
done