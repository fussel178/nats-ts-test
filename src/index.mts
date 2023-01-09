import {connect, DebugEvents, Events, StringCodec} from "nats";
import process from "node:process";
import {registerHandler} from "./util.mjs";

const sc = StringCodec();

// setup and teardown
console.log("Connect to nats-server...");
const nc = await connect({
    user: "devel",
    pass: "12345"
});
console.log("Connected to nats-server");

let called = false;
async function teardown(): Promise<void> {
    if (called) return new Promise(resolve => resolve());
    called = true;
    console.log("Teardown");
    nc.drain().then(() => {
        process.exit(0);
    });
}
process.on("SIGHUP", () => teardown().then(() => process.exit(0)));
process.on("SIGINT", () => teardown().then(() => process.exit(0)));
process.on("SIGTERM", () => teardown().then(() => process.exit(0)));

console.log("Subscribe to subject 'my.subscription'");
const sub = nc.subscribe("my.subscription");
registerHandler(sub, msg => {
    const decoded = sc.decode(msg.data);
    console.log(`Received message (1): ${decoded}`);
    msg.respond(sc.encode("I received your message! (1)"));
});

// debug
console.log("Setup debug event output");

registerHandler(nc.status(), status => {
    switch (status.type) {
        case Events.Reconnect:
            console.log(`Client reconnected - ${status.data}`);
            break;
        case Events.Update:
            console.log(`Client received a cluster update - ${JSON.stringify(status.data)}`);
            break;
        case Events.LDM:
            console.log(`Client has been requested to reconnect - ${status.data}`);
            break;
        case Events.Error:
            console.log(`Client errored - ${status.data}`);
            break;
        case DebugEvents.Reconnecting:
            console.log(`Client is attempting to reconnect - ${status.data}`);
            break;
        case DebugEvents.PingTimer:
            console.log(`Client pinged - ${status.data}`);
            break;
        case DebugEvents.StaleConnection:
            console.log(`Client gone stale - ${status.data}`);
            break;
        case Events.Disconnect:
            console.log(`Client disconnected - ${status.data}`);
            break;
    }
});
