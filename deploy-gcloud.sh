cd js && bash clean.sh && cd ..
gcloud builds submit . --project ellowitz-com --timeout 1200 --machine-type=e2-highcpu-8 --tag=gcr.io/ellowitz-com/metaplex
gcloud run deploy metaplex --image gcr.io/ellowitz-com/metaplex:latest --project ellowitz-com --cpu 2 --memory 8Gi --allow-unauthenticated --region us-central1 --port 3000 --min-instances 1 --max-instances 4
