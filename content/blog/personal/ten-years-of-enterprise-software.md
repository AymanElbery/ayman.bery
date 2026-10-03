---
title: "Ten Years In: What Enterprise Software Taught Me"
description: "Reflections from a decade of building software for ad platforms, fleet tracking, universities and government — and what actually mattered."
date: 2026-07-10
tags: [Career, Reflection]
featured: true
---

I wrote my first production code in 2016, refactoring a legacy PHP application in Cairo. Ten years later I spend my days on identity architectures, event-driven systems and integrations with national services in Riyadh.

The technologies changed almost completely along the way. A handful of lessons didn't.

## The system is bigger than the code

Early on, I thought my job was the code in front of me. Enterprise work cured me of that quickly. The real system includes the network rules, the identity provider, the upstream government service with its own maintenance window, the support engineer who will read your logs at 2 a.m., and the auditor who will ask why a record changed.

Good engineering accounts for all of them.

## Boring is a feature

The platforms I'm proudest of are not the clever ones. They are the ones that quietly served tens of thousands of users through registration peaks, that deployed the same way every time, and that someone else could debug without calling me.

## Legacy code deserves respect

Every legacy system I've modernized was, at some point, somebody's best effort under real constraints. Understanding *why* it looks the way it does is usually the fastest path to changing it safely. Rewrites are tempting; incremental replacement is what actually ships.

## Security can't be bolted on

Working with identity, SSO and government integrations changed how I design everything. Where do tokens live? Who can call this endpoint? What happens when this upstream lies, or disappears? Those questions are cheap at design time and expensive afterwards.

## Leading is mostly listening

Reviews, mentoring and architecture discussions taught me that the best technical decision is often the one the team understands well enough to maintain. Standards and shared libraries matter — but only when people see why they exist.

## What's next

I'm still most energized by the same thing as ten years ago: taking a messy, important problem and turning it into a system that people can rely on. The difference is that now I know reliability is designed, not hoped for.

This blog is where I'll write down the parts worth remembering.
