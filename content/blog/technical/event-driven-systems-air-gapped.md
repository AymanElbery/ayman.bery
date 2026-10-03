---
title: "Shipping Event-Driven Systems into Air-Gapped Networks"
description: "Practical lessons from deploying NestJS, RabbitMQ and Redis into restricted environments with no internet access — packaging, operations and failure handling."
date: 2026-06-02
tags: [RabbitMQ, DevOps, Distributed Systems, Linux]
---

Most deployment guides quietly assume one thing: that the server can reach the internet. `npm install`, `docker pull`, `dnf update` — all of them phone home.

In an air-gapped network, none of that works. Every dependency has to be carried in deliberately, and every failure has to be diagnosable by the people inside the network, with only the tools that are already there.

Here is what I've learned running event-driven systems in that world.

## 1. Treat the artifact as the product

When you can't fetch anything at deploy time, **the deployment artifact becomes the product.** I build a single, versioned bundle per release:

- Docker images exported with `docker save` and compressed.
- A `docker-compose.yml` and environment templates.
- Checksums for every file.
- A short, plain-text runbook.

```bash
docker save \
  registry.local/bff:1.14.0 \
  registry.local/workflow-svc:1.14.0 \
  rabbitmq:3.13-management \
  redis:7.2-alpine \
  | gzip > release-1.14.0.tar.gz

sha256sum release-1.14.0.tar.gz > release-1.14.0.sha256
```

The bundle is built and scanned outside, transferred through the approved channel, verified, and loaded with `docker load`. If a release can't be reproduced from its bundle, it isn't a release.

## 2. Mirror your package registries — once

For developers working inside the network, an internal npm registry mirror (Verdaccio or Nexus) removes most of the pain. The key is to curate it: pull the dependency tree for your lockfiles, not "everything". Lockfiles stop being a nice-to-have and become a security boundary.

## 3. Design queues for the day things go wrong

In a connected environment, you can often fix a bad message by shipping a patch within the hour. Inside a restricted network, that loop can take days. So the messaging topology has to assume failure:

- **Dead-letter exchanges on every queue.** A poison message should never block a queue.
- **Bounded retries with delay.** Retry with a TTL-based delay queue rather than hot-looping.
- **Idempotent consumers.** Redelivery will happen; design for it with a message ID and a processed-message check.

```typescript
@EventPattern('permit.requested')
async handle(@Payload() event: PermitRequested, @Ctx() ctx: RmqContext) {
  if (await this.inbox.seen(event.id)) return this.ack(ctx);

  await this.dataSource.transaction(async (tx) => {
    await this.permits.create(tx, event);
    await this.inbox.record(tx, event.id);
  });

  this.ack(ctx);
}
```

Prefer **quorum queues** for anything you cannot afford to lose; they behave far more predictably during node failures than classic mirrored queues.

## 4. Make the system explain itself

The on-call engineer inside the network may not be the person who wrote the code, and may not be able to send you logs. Invest in:

- Structured JSON logs with a correlation ID that crosses HTTP and AMQP boundaries.
- Health endpoints that check real dependencies (broker, Redis, database), not just "process is up".
- A management UI (RabbitMQ's is excellent) reachable only on the internal admin network.

## 5. Use the operating system you already have

On RHEL, `systemd` is a perfectly good supervisor. Wrapping `docker compose up` in a unit file with restart policies, and letting `journald` hold the logs, means one less tool to carry across the gap.

## The mindset shift

Air-gapped delivery rewards the same things good distributed-systems design rewards everywhere: explicit dependencies, idempotency, observability and boring, repeatable releases. The constraint just removes the option of skipping them.
