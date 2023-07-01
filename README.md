# aries-javascript-ssi-implementation
Demo code that implements fundamental flows of SSI (i.e: issuing credential, receiving &amp; storing credential, verifying credential)

# Prerequisites
-> Make sure node version is 18+ </br>
-> Install node modules ```npm i``` </br>

# Testing
-> Run ```ts-node index.ts``` if you've installed **ts-node** globally or run ```npx ts-node index.ts``` </br>

# Issuer
In this example, a "Lab" agent will act as the issuer of verification credential. In real projects, this agent will be a server agent that is actively listening for connections.

# Holder
In this example, a "Farmer" agent will act as the holder of verification credential. In real projects, this agent will be a mobile wallet with a relay server.

# Verifier
In this example, a "Consumer" agent will act as the verifier of verification credential. In real projects, this agent can be a server agent or a mobile agent. 

