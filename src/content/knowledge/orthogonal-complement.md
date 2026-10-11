---
title: "Orthogonal Complement"
date: 2026-10-11
topic: ai/mathematics/analytic-geometry
status: growing
order: 7
description: "부분공간 U와 모든 방향에서 수직인 벡터들의 공간 U⊥, 그리고 직합분해."
tags: [analytic-geometry, orthogonality]
links:
  - type: knowledge
    slug: orthogonal-orthonormal-matrix
    rel: prerequisite
---

## 무엇이며 왜 필요한가?

### 개념 간단 이해

3차원 공간에 떠 있는 **드론의 위치**를 AI가 계산한다고 해보자.

1. **바닥 평면 (**$U$**):** 지도상의 위치 (동서, 남북 위치)
2. **수직 기둥 (**$U^{\perp}$**):** 드론의 높이 (위아래 위치)

드론의 전체 위치 $x$는 언제나 **`[지도상의 위치] + [높이]`** 두 부분으로 나누어 생각할 수 있다.

이때 $U^{\perp}$는 $U$**의 모든 방향과 직교하는 방향들을 모아놓은 공간**이다.
즉, Orthogonal Complement(직교여집합)는 하나의 공간 $U$에 대해 **그 공간과 완전히 수직인 방향들을 따로 모아놓은 공간**이라고 이해하면 된다

### AI는 이걸로 뭘 하나요?

AI가 다루는 데이터는 $1,000$차원처럼 매우 높은 차원을 가질 수 있다.
이때 데이터가 가진 모든 방향을 똑같이 다루는 대신, **특정 목적에 중요한 정보가 담긴 공간** $U$와 그에 직교하는 $U^{\perp}$로 나누어 생각할 수 있다.

예를 들어 **PCA와 같은 차원축소**에서는 데이터의 중요한 변동이 나타나는 저차원 공간 $U$를 선택하고, 상대적으로 덜 중요한 $U^{\perp}$ 방향의 정보를 제거하여 데이터를 더 낮은 차원에서 표현할 수 있다.

따라서 Orthogonal Complement는 <strong>단순히 "수직인 공간"</strong>을 정의하는 것을 넘어, **고차원 공간을 서로 직교하는 방향으로 분해해서 바라보는 관점**을 제공한다.

## 정의

공간 $V$의 부분공간 $U$가 있을 때, $U^\perp$는 **"$U$ 안의 모든 벡터 $u$와 내적했을 때 $0$이 되는 벡터 $x$들의 집합"** 입니다.

$U^\perp = \{ x \in V \mid \langle x, u \rangle = 0 \quad \forall u \in U \}$

## Direct Sum Decomposition, 직합분해

전체 공간 $V$의 어떤 벡터 $x$를 가져와도, $U$에 속하는 벡터 $x_U$와 $U^\perp$에 속하는 벡터 $x_{U^\perp}$의 합으로 단 한 가지 방법(유일하게)으로 쪼갤 수 있다.

$x = x_U + x_{U^\perp} \quad \left(\text{단, } x_U \in U, \; x_{U^\perp} \in U^\perp\right)$

모든 벡터를 $U$ 성분과 $U^\perp$ 성분으로 유일하게 분해할 수 있다.

$V=U\oplus U^\perp $

## Dimension Theorem, 차원의 정리

두 직교 공간의 차원을 더하면 정확히 전체 공간의 차원이 된다

$\dim(U) + \dim(U^\perp) = \dim(V)$

전체 공간 $V$가 $D$차원이고 $U$가 $M$차원이면, $U^\perp$는 반드시 $(D - M)$차원이다.

## Trivial Intersection, 영벡터 교집합

$U$에 속하면서 동시에 $U$의 모든 벡터와 직교하는 벡터는 0벡터뿐이다.

$U \cap U^\perp = \{ \mathbf{0} \}$

## Normal Vector, 법선 벡터

**어떤 평면이나 곡면, 직선에 수직인 방향을 가리키는 벡터**

$\dim(U^\perp)=1$일 때 $U^\perp$의 $0$이 아닌 모든 벡터는 $U$에 수직인 방향을 나타내며, 이를 normal vector(법선 벡터)라 한다.
그중 $\Vert w\Vert =1$인 벡터를 unit normal vector(단위 법선 벡터)라 한다.

## 추가정보

고차원 공간($D$차원)에서 $(D-1)$차원의 초평면(Hyperplane)을 정의할 때도, $1$차원 직교여공간 $U^\perp$의 법선 벡터 $w$ 하나만으로 간단하게 표현할 수 있다.

ex. $1,000$차원 공간에서 $999$차원 초평면 $U$를 정의할 때, $999$개의 기저 벡터를 일일이 나열하는 대신 직교여공간 $U^\perp$의 $1$차원 법선 벡터 $w$ 하나만으로 간결하게 표현할 수 있다.
이는 차원의 정리($D - M = 1000 - 999 = 1$)에 의해 수직인 방향이 단 하나만 존재하기 때문에 가능하다.
따라서 거대한 고차원 초평면도 법선 벡터와의 내적이 $0$이 되는 점들의 집합($U = \{ x \in \mathbb{R}^{1000} \mid \langle w, x \rangle = 0 \}$)이라는 한 줄 수식으로 깔끔하게 정의된다.
