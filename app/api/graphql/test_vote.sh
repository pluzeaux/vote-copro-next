#!/bin/bash

# ===========================
# CONFIGURATION
# ===========================
GRAPHQL_URL="http://localhost:3000/api/graphql"
TOKEN="TON_TOKEN_ICI"             # Remplace par un token valide
ADMIN_PASSWORD="TON_MDP_ADMIN"    # Pour adminResults

# ===========================
# 1️⃣ Récupérer toutes les résolutions
# ===========================
echo "=== 1️⃣ Récupération des résolutions ==="
curl -s -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -d '{"query": "{ resolutions { id title description choices { id title } } }"}' | jq
echo -e "\n"

# ===========================
# 2️⃣ Tester la mutation login
# ===========================
echo "=== 2️⃣ Login avec token ==="
LOGIN_RESPONSE=$(curl -s -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"mutation Login(\$token: String!) { login(token: \$token) { tokenId weight } }\",
    \"variables\": { \"token\": \"$TOKEN\" }
  }" | jq)
echo "$LOGIN_RESPONSE"
echo -e "\n"

# ===========================
# 3️⃣ Voter pour quelques résolutions
# ===========================
echo "=== 3️⃣ Envoyer les votes ==="
curl -s -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"mutation Vote(\$token: String!, \$votes: [VoteInput!]!) { vote(token: \$token, votes: \$votes) }\",
    \"variables\": {
      \"token\": \"$TOKEN\",
      \"votes\": [
        { \"resolutionId\": 1, \"choice\": { \"id\": 1, \"title\": \"pour\" } },
        { \"resolutionId\": 2, \"choice\": { \"id\": 2, \"title\": \"contre\" } }
      ]
    }
  }" | jq
echo -e "\n"

# ===========================
# 4️⃣ Vérifier les résultats admin
# ===========================
echo "=== 4️⃣ Résultats admin ==="
curl -s -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "x-admin-password: $ADMIN_PASSWORD" \
  -d '{
    "query": "{ adminResults { resolutionId choice totalWeight votesCount } }"
  }' | jq
echo -e "\n"

echo "=== FIN DU SCRIPT ==="
