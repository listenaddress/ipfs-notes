# IPFS Notes

This demo is meant to help me/you get feel for running an [IPFS](https://ipfs.io/) node in the browser, as well as creating and displaying IPFS data.

The app creates a node that's connected to the IPFS network and allows the user to create a note that's saved as an IPFS object. The object will get a hash address that's accessible to any node on the network. This can be tested by going to `https://ipfs.io/ipfs/${hash}`. If you want to make sure an object sticks around, you'll need to [pin it](https://ipfs.io/docs/commands/#ipfs-pin-add) to another node you're running.

## Run the app

```bash
> npm i
> node server.js
```

Bless up at `http://localhost:3000`
