---
title: "기저 변환"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/linear-maps
status: seed
order: 6
---

> 같은 벡터나 선형사상을 다른 기저에서 표현하기 위해,
그 좌표 또는 행렬 표현을 바꾸는 것.
>
> <strong>벡터 자체는 같고, 표현하는 좌표계가 바뀌는 것.</strong>

<details>

<summary><strong>왜 필요한가</strong></summary>

- 하나의 벡터 v도 기저에 따라 좌표가 달라진다. $[v]_B≠[v]_B̃$
- 하나의 선형사상 $\Phi$도 사용하는 입력·출력 기저에 따라 행렬 표현이 달라진다
- 따라서 기저를 바꾸면 기존 좌표와 행렬 표현을 새로운 좌표계에 맞게 변환해야한다.
- 특히, 적절한 기저를 선택하면 복잡한 선형 사상의 행렬을 단순하게 만들 수 있다.

</details>

<details>

<summary><strong>직관</strong></summary>

<details>

<summary>도입</summary>

> <strong>기존 기저 : </strong>$B = (b_1, b_2)$<strong>, 새 기저 : </strong>$B̃=(\widetilde{b}_1, \widetilde{b}_2)$<strong> </strong>라고 하자.
>
> 하나의 벡터 v는 기저에 따라 서로 다른 방식으로 표현될 수 있다.
>
> $v=3b_1+2b_2$ 이면서 동시에 $v=5\widetilde{b}_1-\widetilde{b}_2$ 일 수 있다.


</details>

<details>

<summary><strong>기저변환 행렬 S</strong></summary>

> 현재 우리의 목적은 <strong>하나의 동일한 벡터 v를 서로 다른 기저에서 표현했을 때, 그 좌표가 어떻게 변환되는지 알아보는 것</strong>이다.

</details>

<details>

<summary><strong>선형사상의 행렬도 똑같다.</strong></summary>

<details>

<summary>도입</summary>

- 선형사상 $\Phi : V \rightarrow W$가 있다고 하자. (V : 입력벡터가 속하는 공간, W: 출력벡터가 속하는 공간)

> 입력공간 $V$와 출력공간 $W$에는 각각 기존기저와 새로운 기저가 있다.
>
> | 공간 | 기존기저 | 새 기저 |
> | --- | --- | --- |
> | V | B | B̃ |
> | W | C | C̃ |

</details>

<details>

<summary><strong>전개</strong></summary>

<details>

<summary>1. 실제 벡터의 변환</summary>

> 실제 공간에서는 $v \in V \xrightarrow{\Phi} \Phi(v) \in W$이다.
즉, 실제 벡터를 입력공간 $V$에서 출력공간 $W$로 보내는 것은 선형사상 $\Phi$이다.

</details>

<details>

<summary>2. 이를 좌표로 표현</summary>

> 행렬 계산을 하기 위해 벡터를 각 공간의 기저를 기준으로 좌표화한다.
>
> > $v \rightarrow [v]_B$ $,$  $\Phi(v) \rightarrow [\Phi(v)]_C$
>
> 그리고 $\Phi$의 이러한 변환을 좌표 관계로 표현한 행렬이 $A_{\Phi}$이다.
따라서 $[v]_B \xrightarrow{A_\Phi} [\Phi(v)]_C$ 즉, $[\Phi(v)]_C = A_\Phi[v]_B$ 이다.

</details>

<details>

<summary>3. $A_{\Phi}$의 정확한 의미</summary>

> $[A_{\Phi}: B-기준 입력좌표$  $\rightarrow$ $C-기준 출력 좌표]$ 라고 생각하면 된다.
>
> 단, $A_{\Phi}$가 기저를 바꾸는 것은 아니다. 이미 선택되어 있는 입력기저 $B$와 출력기저 $C$를 기준으로 선형사상 $\Phi$를 표현하는 것이다.

</details>

<details>

<summary>4. $A_{\Phi}$는 $C$로 표현한 $\Phi(B)$이다.</summary>

> 앞서 “기저변환 행렬 $S$”에서 일반화 하였듯, $[v]_B = S[v]_{\widetilde{B}}$에서 $S$는 $\widetilde{B}$의 원소 각각을 $B$의 선형결합으로 표현했을 때 각각의 계수 벡터이다.
>
> 따라서 $[\Phi(v)]_C = A_\Phi[v]_B$에서 $A_\Phi$ 의 $j$번째 열은 $\Phi(b_j)$ 를 $C$ 로 표현한 계수벡터 $[\Phi(b_j)]_C$ 이다. 즉 $A_\Phi=\big[\,[\Phi(b_1)]_C\ \cdots\ [\Phi(b_n)]_C\,\big]$.

</details>

</details>

<details>

<summary><strong>활용</strong></summary>

<details>

<summary>선형사상 $\Phi$의 입력·출력 기저를 바꾸면</summary>

> 기존 기저 $B$, $C$를 새로운 기저 $\tilde B$, $\tilde C$ 로 바꾼다고 하자. 우리가 원하는 것은  $[v]_{\tilde B} \xrightarrow{A_\Phi} [\Phi(v)]_{\tilde C}$이다.
그런데 기존 행렬 $A_{\Phi}$는 $[v]_B \xrightarrow{A_\Phi} [\Phi(v)]_C$를 처리하도록 만들어져있다.

> 따라서 $\tilde B \rightarrow B$, $C \rightarrow \tilde C$ 의 매커니즘을 이용한다.
>
> > $\tilde B \xrightarrow {S} B$,  $B \xrightarrow {A_{\Phi}} C$,  $C \xrightarrow {T^{-1}} \tilde C$
>
> 따라서 $\tilde A_{\Phi} = T^{-1}A_{\Phi}S$가 된다.

</details>

<details>

<summary>$T$와 $T^{-1}$</summary>

> $T$도 $S$와 같은 종류의 좌표변환 행렬이다. 새로운 출력 기저 $\tilde C$의 벡터들을 기존 출력 기저 $C$로 표현하여 만든다.
따라서 $[w]_C \rightarrow T[w]_{\tilde C}$ 즉, $\tilde C \rightarrow C$이다.  그런데 우리는 $C \rightarrow \tilde  C$가 필요하므로, 양벤여 $T^{-1}$을 곱해 $T^{-1}[w]_C = [w]_{\tilde C}$가 된다.
따라서 출력 좌표를 $\tilde C$로 바꾸기 위해 $T^{-1}$ 등장

</details>

<details>

<summary>$\tilde A_{\Phi} = T^{-1}A_{\Phi}S$</summary>

> 해당 공식을 말로 풀어 정리해보자.
기저 $\tilde B$에서의 좌표를 $B-좌표$로 변환한 후, $\Phi$를 적용하여 $C-좌표$로 보내고, 다시 $\tilde C-좌표$로 변환한다.

</details>

<details>

<summary><strong>닮은 행렬(Similar Matrices)</strong></summary>

> 같은 공간 $V$의 선형사상 $\Phi: V \to V$를 서로 다른 두 기저에서 표현한 행렬은 $\tilde{A} = S^{-1}AS$ 꼴로 나타난다.
이러한 두 행렬을 닮은 행렬이라고 한다.
즉, 같은 선형사상에 대한 서로 다른 좌표 표현이다.

$\det(\tilde{A}) = \det(S^{-1}AS) = \det(A)$

</details>

</details>

</details>

</details>

<details>

<summary><strong>이걸 모르면? </strong></summary>

- 닮음 변환
- 고유값·고유벡터
- 대각화
- PCA의 좌표계 및 기저변화
- 이후 다양한 선형 변환의 좌표표현 어려움.

</details>

<details>

<summary><strong>문제</strong></summary>

[Untitled](https://app.notion.com/p/3c909d87213b80d2a2fcd441fdb4a81a)

[Untitled](https://app.notion.com/p/3c909d87213b80fcaca2fb34f6c18afc)

</details>
