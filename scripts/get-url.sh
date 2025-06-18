#!/bin/bash

echo "⏳ Waiting for Frontend Ingress..."
sleep 10
INGRESS_FRONTEND=$(kubectl get ingress ai-finops-frontend -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
echo "✅ Frontend available at: http://${INGRESS_FRONTEND}"

echo "⏳ Waiting for Backend Ingress..."
INGRESS_BACKEND=$(kubectl get ingress ai-finops-app -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
echo "✅ Backend API available at: http://${INGRESS_BACKEND}/api"



