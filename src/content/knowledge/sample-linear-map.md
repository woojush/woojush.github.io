---
title: 선형사상
description: 검증용 임시 샘플. 선형사상, 상(image)과 핵(kernel)의 뜻.
topic: mathematics/linear-algebra
status: growing
order: 2
date: 2026-10-06
tags: [linear-algebra, sample]
links:
  - { type: knowledge, slug: sample-vector-space, rel: prerequisite }
draft: true
---

> 검증용 임시 샘플이다. 실제 노트가 생기면 삭제한다.

## 핵심 아이디어

선형사상 $\Phi: V \to W$는 덧셈과 스칼라곱을 보존한다: $\Phi(\lambda x + \psi y) = \lambda \Phi(x) + \psi \Phi(y)$.

- **상(image):** $\mathrm{Im}(\Phi) = \{\Phi(x) : x \in V\}$
- **핵(kernel):** $\ker(\Phi) = \{x \in V : \Phi(x) = 0\}$

| 이름 | 어디에 있나 | 뜻 |
|------|-------------|----|
| 핵 | $V$ 안 | 0으로 사라지는 입력 |
| 상 | $W$ 안 | 실제로 도달하는 출력 |

## 표현

기저를 정하면 선형사상은 행렬로 표현된다[^1].

## 정리

핵과 상은 각각 부분공간이다.

[^1]: 같은 선형사상도 기저를 바꾸면 다른 행렬로 표현된다.
