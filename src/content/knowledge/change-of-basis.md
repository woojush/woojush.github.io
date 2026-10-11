---
title: "기저 변환"
date: 2026-10-11
topic: ai/mathematics/linear-algebra
status: growing
order: 6
description: "같은 벡터와 선형사상을 다른 기저에서 표현할 때 좌표와 행렬이 어떻게 바뀌는가."
tags: [linear-algebra, basis]
links:
  - type: knowledge
    slug: finite-dimensional-vector-spaces
    rel: builds-on
---

같은 벡터나 선형사상을 다른 기저에서 표현하기 위해,
그 좌표 또는 행렬 표현을 바꾸는 것.

**벡터 자체는 같고, 표현하는 좌표계가 바뀌는 것.**

## 왜 필요한가
- 하나의 벡터 v도 기저에 따라 좌표가 달라진다. $[v]_B\ne [v]_B̃$
- 하나의 선형사상 $\Phi$도 사용하는 입력·출력 기저에 따라 행렬 표현이 달라진다
- 따라서 기저를 바꾸면 기존 좌표와 행렬 표현을 새로운 좌표계에 맞게 변환해야한다.
- 특히, 적절한 기저를 선택하면 복잡한 선형 사상의 행렬을 단순하게 만들 수 있다.

## 직관

### 도입

**기존 기저 :** $B = (b_1, b_2)$**, 새 기저 :** $B̃=(\widetilde{b}_1, \widetilde{b}_2)$ 라고 하자.

하나의 벡터 v는 기저에 따라 서로 다른 방식으로 표현될 수 있다.

$v=3b_1+2b_2$ 이면서 동시에 $v=5\widetilde{b}_1-\widetilde{b}_2$ 일 수 있다.

### 기저변환 행렬 S

현재 우리의 목적은 **하나의 동일한 벡터 v를 서로 다른 기저에서 표현했을 때, 그 좌표가 어떻게 변환되는지 알아보는 것**이다.

### 선형사상의 행렬도 똑같다.

#### 도입
- 선형사상 $\Phi : V \rightarrow W$가 있다고 하자. (V : 입력벡터가 속하는 공간, W: 출력벡터가 속하는 공간)

입력공간 $V$와 출력공간 $W$에는 각각 기존기저와 새로운 기저가 있다.

| 공간 | 기존기저 | 새 기저 |
| --- | --- | --- |
| V | B | B̃ |
| W | C | C̃ |

#### 전개

##### 1. 실제 벡터의 변환

실제 공간에서는 $v \in V \xrightarrow{\Phi} \Phi(v) \in W$이다.
즉, 실제 벡터를 입력공간 $V$에서 출력공간 $W$로 보내는 것은 선형사상 $\Phi$이다.

##### 2. 이를 좌표로 표현

행렬 계산을 하기 위해 벡터를 각 공간의 기저를 기준으로 좌표화한다.

$v \rightarrow [v]_B$ $,$  $\Phi(v) \rightarrow [\Phi(v)]_C$

그리고 $\Phi$의 이러한 변환을 좌표 관계로 표현한 행렬이 $A_{\Phi}$이다.
따라서 $[v]_B \xrightarrow{A_\Phi} [\Phi(v)]_C$ 즉, $[\Phi(v)]_C = A_\Phi[v]_B$ 이다.

##### 3. A_Φ의 정확한 의미

$[A_{\Phi}: B-기준 입력좌표$  $\rightarrow$ $C-기준 출력 좌표]$ 라고 생각하면 된다.

단, $A_{\Phi}$가 기저를 바꾸는 것은 아니다. 이미 선택되어 있는 입력기저 $B$와 출력기저 $C$를 기준으로 선형사상 $\Phi$를 표현하는 것이다.

##### 4. A_Φ는 C로 표현한 Φ(B)이다.

앞서 “기저변환 행렬 $S$”에서 일반화 하였듯, $[v]_B = S[v]_{\widetilde{B}}$에서 $S$는 $\widetilde{B}$의 원소 각각을 $B$의 선형결합으로 표현했을 때 각각의 계수 벡터이다.

따라서 $[\Phi(v)]_C = A_\Phi[v]_B$에서 $A_\Phi$ 의 $j$번째 열은 $\Phi(b_j)$ 를 $C$ 로 표현한 계수벡터 $[\Phi(b_j)]_C$ 이다. 즉 $A_\Phi=\big[\,[\Phi(b_1)]_C\ \cdots\ [\Phi(b_n)]_C\,\big]$.

#### 활용

##### 선형사상 Φ의 입력·출력 기저를 바꾸면

기존 기저 $B$, $C$를 새로운 기저 $\tilde B$, $\tilde C$ 로 바꾼다고 하자. 우리가 원하는 것은  $[v]_{\tilde B} \xrightarrow{A_\Phi} [\Phi(v)]_{\tilde C}$이다.
그런데 기존 행렬 $A_{\Phi}$는 $[v]_B \xrightarrow{A_\Phi} [\Phi(v)]_C$를 처리하도록 만들어져있다.

따라서 $\tilde B \rightarrow B$, $C \rightarrow \tilde C$ 의 메커니즘을 이용한다.

$\tilde B \xrightarrow {S} B$,  $B \xrightarrow {A_{\Phi}} C$,  $C \xrightarrow {T^{-1}} \tilde C$

따라서 $\tilde A_{\Phi} = T^{-1}A_{\Phi}S$가 된다.

##### T와 T⁻¹

$T$도 $S$와 같은 종류의 좌표변환 행렬이다. 새로운 출력 기저 $\tilde C$의 벡터들을 기존 출력 기저 $C$로 표현하여 만든다.
따라서 $[w]_C \rightarrow T[w]_{\tilde C}$ 즉, $\tilde C \rightarrow C$이다.  그런데 우리는 $C \rightarrow \tilde  C$가 필요하므로, 양변에 $T^{-1}$을 곱해 $T^{-1}[w]_C = [w]_{\tilde C}$가 된다.
따라서 출력 좌표를 $\tilde C$로 바꾸기 위해 $T^{-1}$ 등장

##### Ã_Φ = T⁻¹A_ΦS

해당 공식을 말로 풀어 정리해보자.
기저 $\tilde B$에서의 좌표를 $B-좌표$로 변환한 후, $\Phi$를 적용하여 $C-좌표$로 보내고, 다시 $\tilde C-좌표$로 변환한다.

##### 닮은 행렬(Similar Matrices)

같은 공간 $V$의 선형사상 $\Phi: V \to V$를 서로 다른 두 기저에서 표현한 행렬은 $\tilde{A} = S^{-1}AS$ 꼴로 나타난다.
이러한 두 행렬을 닮은 행렬이라고 한다.
즉, 같은 선형사상에 대한 서로 다른 좌표 표현이다.

$\det(\tilde{A}) = \det(S^{-1}AS) = \det(A)$

## 이걸 모르면?
- 닮음 변환
- 고유값·고유벡터
- 대각화
- PCA의 좌표계 및 기저변화
- 이후 다양한 선형 변환의 좌표표현 어려움.

## 연습문제

MML 연습문제 2.19, 2.20.
