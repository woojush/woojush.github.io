---
title: "Finite-dimensional Vector Spaces"
date: 2026-10-11
topic: ai/mathematics/linear-algebra
status: growing
order: 5
description: "차원이 같은 유한차원 벡터공간은 좌표를 손실 없이 서로 대응시킬 수 있다."
tags: [linear-algebra]
links:
  - type: knowledge
    slug: rank-nullity
    rel: related
---

차원이 같다는 것은 “선형대수적 관점에서 같은 양의 자유도를 가진다”는 의미이고,
따라서 한 공간의 좌표를 다른 공간의 좌표로 손실 없이 대응시킬 수 있다.

## 주의 사항

**“차원이 같으면 모든 선형변환이 bijection이다”** 인 것은 아니다.
**”차원이 같으면 bijection인 선형변환을 하나 이상 만들 수 있다”** 는 것이다.

ex) $A=\begin{bmatrix}1&1\\2&2\end{bmatrix}$ 는 $\mathbb{R}^2\to\mathbb{R}^2$ 의 선형변환이지만 $\text{rank}(A)=1$ 이라 bijection이 아니다. 반면 $I=\begin{bmatrix}1&0\\0&1\end{bmatrix}$ 은 같은 차원 사이의 bijection이다. 즉 차원이 같으면 bijection인 선형변환이 (하나 이상) 존재할 뿐이다.

## 연습문제

MML 연습문제 2.12, 2.13, 2.14, 2.15, 2.17.
