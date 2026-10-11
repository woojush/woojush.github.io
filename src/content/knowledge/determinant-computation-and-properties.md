---
title: "Determinant의 계산과 성질"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/determinant-trace
status: seed
order: 2
---

> 큰 행렬의 det를 <strong>한 단계 작은 행렬의 det들로 쪼개는 재귀 공식</strong>(Laplace Expansion)과, det가 항상 지키는 <strong>성질들</strong>.

<details>

<summary><strong>배경지식 (0에서 시작)</strong></summary>

<details>

<summary>① 소행렬(minor)과 여인수(cofactor)</summary>

> $A_{k,j}\in\mathbb{R}^{(n-1)\times(n-1)}$ : A에서 $k$<strong>행과 </strong>$j$<strong>열을 지워서</strong> 얻은 행렬.
$\det(A_{k,j})$를 minor, $(-1)^{k+j}\det(A_{k,j})$를 cofactor라 부른다.

</details>

<details>

<summary>② 삼각행렬</summary>

> 상삼각행렬(upper-triangular) : $T_{ij}=0\;(i>j)$, 즉 <strong>대각선 아래가 전부 0</strong>.
하삼각행렬(lower-triangular) : 대각선 위가 전부 0.

</details>

<details>

<summary>③ 기본행연산 3종 (2장 가우스 소거)</summary>

> 행 교환 / 한 행에 0이 아닌 상수 곱하기 / 한 행을 다른 행에 더하기.
가우스 소거는 이 세 연산만으로 행렬을 계단(삼각) 모양으로 만드는 알고리즘이다.

</details>

</details>

<details>

<summary><strong>왜 필요한가</strong></summary>

> $1\times1$, $2\times2$, $3\times3$에는 직접 쓰는 공식이 있지만, $n\ge4$부터는 <strong>일반 알고리즘</strong>이 필요하다.
Laplace 전개는 $n\times n$ → $(n-1)\times(n-1)$ → … → $2\times2$로 문제를 줄여 준다.

> 한편 det가 지키는 성질들은 (1) 계산을 훨씬 싸게 만들고(가우스 소거), (2) det의 의미(부피 배율)를 확인시켜 주며, (3) 4.2 이후의 논리에서 직접 쓰인다.

</details>

<details>

<summary><strong>1) 작은 행렬의 공식</strong></summary>

- $n=1$ : $\det(a_{11})=a_{11}$
- $n=2$ : $\det(A)=a_{11}a_{22}-a_{12}a_{21}$
- $n=3$ (Sarrus' rule) :

$$
\det(A)=a_{11}a_{22}a_{33}+a_{21}a_{32}a_{13}+a_{31}a_{12}a_{23}-a_{31}a_{22}a_{13}-a_{11}a_{32}a_{23}-a_{21}a_{12}a_{33}
$$

※ Sarrus는 $3\times3$ 전용이다. $4\times4$ 이상으로 확장되지 않는다.

</details>

<details>

<summary><strong>2) Laplace Expansion</strong></summary>

> <strong>Theorem 4.2</strong> 고정된 $j$에 대해
열 $j$를 따라 전개 : $\det(A)=\sum_{k=1}^{n}(-1)^{k+j}\,a_{kj}\,\det(A_{k,j})$
행 $j$를 따라 전개 : $\det(A)=\sum_{k=1}^{n}(-1)^{k+j}\,a_{jk}\,\det(A_{j,k})$

<div class="callout" role="note" data-kind="intuition">

<strong>부호 </strong>$(-1)^{k+j}$<strong>는 체스판 무늬이다.</strong>

$$
\begin{bmatrix}+&-&+\\-&+&-\\+&-&+\end{bmatrix}
$$

$j$ = 내가 고정한 행(열) 번호, $k$ = 합을 따라 움직이는 번호.

\[보완\] 위의 일반 기호 공식 자체를 외울 필요는 없다. 이 학습의 목적(AI/ML)에서 필요한 것은 “행(열) 하나를 고정하고, 체스판 부호 × 원소 × 소행렬의 det를 더해 간다”는 알고리즘을 이해하는 정도이고, 아래 예시 (a)(b)(c)로 확인하는 것으로 충분하다. 0이 많은 행(열)을 고르면 계산이 빨라진다는 감각만 챙기자.

</div>

<details>

<summary>예시 : 같은 행렬, 세 가지 방법</summary>

> $A=\begin{bmatrix}1&2&3\\3&1&2\\0&0&1\end{bmatrix}$

<details>

<summary>(a) 1행을 따라 전개</summary>

> $\det(A)=(+1)\cdot1\cdot\det\begin{bmatrix}1&2\\0&1\end{bmatrix}+(-1)\cdot2\cdot\det\begin{bmatrix}3&2\\0&1\end{bmatrix}+(+1)\cdot3\cdot\det\begin{bmatrix}3&1\\0&0\end{bmatrix}$
$=1\cdot1-2\cdot3+3\cdot0=-5$

</details>

<details>

<summary>(b) 3행을 따라 전개 : 0이 많은 행을 고르면 훨씬 쉽다</summary>

> 3행은 $(0,0,1)$이라 $a_{33}$만 살아남는다.
$\det(A)=(+1)\cdot1\cdot\det\begin{bmatrix}1&2\\3&1\end{bmatrix}=1\cdot(1-6)=-5$

</details>

<details>

<summary>(c) Sarrus</summary>

> $\det(A)=1\cdot1\cdot1+3\cdot0\cdot3+0\cdot2\cdot2-0\cdot1\cdot3-1\cdot0\cdot2-3\cdot2\cdot1=1-6=-5$

</details>

</details>

</details>

<details>

<summary><strong>3) det의 성질</strong></summary>

| 성질 | 부피 · 좌표 관점의 이유 |
| --- | --- |
| $\det(AB)=\det(A)\det(B)$ | B가 부피를 $\det B$배로 만들고, 이어서 A가 $\det A$배로 만든다. 합성은 배율의 곱. ($AB$는 B를 먼저 적용) |
| $\det(A)=\det(A^\top)$ | 행과 열이 같은 역할을 한다. 그래서 행에 대한 성질이 열에도 성립하고, Laplace를 행·열 어느 쪽으로도 전개할 수 있다. |
| $\det(A^{-1})=\dfrac{1}{\det(A)}$ | A가 부피를 $d$배로 만들었다면, 되돌리는 $A^{-1}$는 $1/d$배. ($A$는 invertible) |
| 닮은 행렬은 같은 det : $\det(S^{-1}AS)=\det(A)$ | $S^{-1}AS$는 같은 선형사상을 다른 기저에서 본 행렬이다. 부피 배율은 좌표계와 무관하다. \[보완\] 표현 방식(기저)이 바뀌어도 이 선형사상이 공간의 부피를 몇 배로 바꾸는지는 똑같다. 즉 det는 특정한 좌표 표현 $A$에만 붙은 성질이라기보다, 그 행렬이 나타내는 선형사상 $\Phi$의 성질이라고 보는 것이 맞다. |
| 한 행(열)의 상수배를 다른 행(열)에 더해도 det 불변 | 전단(shear). 밑변과 높이가 그대로라 넓이가 안 변한다. |
| 한 행(열)에 $\lambda$를 곱하면 det가 $\lambda$배. 따라서 $\det(\lambda A)=\lambda^n\det(A)$ | 한 변이 $\lambda$배면 부피도 $\lambda$배. $n$개의 변이 모두 $\lambda$배이므로 $\lambda^n$배. |
| 두 행(열)을 맞바꾸면 det의 부호가 바뀐다 | 도형은 같고 방향만 뒤집힌다. |
| 삼각행렬 : $\det(T)=\prod_{i=1}^{n}T_{ii}$ | 전단은 부피를 안 바꾸므로, 남는 것은 각 축 방향으로 늘이는 배율(대각 성분)의 곱뿐이다. \[보완\] 삼각행렬이란 주대각선을 기준으로 위쪽 또는 아래쪽의 모든 성분이 0인 정사각행렬이다. 그래서 대각 성분의 곱이 곧 행렬식이다. |

<details>

<summary>닮은 행렬이 같은 det를 갖는 이유 (한 줄 증명)</summary>

> $\det(S^{-1}AS)=\det(S^{-1})\det(A)\det(S)=\dfrac{1}{\det(S)}\det(A)\det(S)=\det(A)$
즉 det는 행렬 한 장의 성질이 아니라 <strong>선형사상 자체의 성질</strong>이다.

</details>

</details>

<details>

<summary><strong>4) 실전 계산법 : 가우스 소거로 삼각화</strong></summary>

<div class="callout" role="note" data-kind="intuition">

위 성질들 덕분에 가우스 소거로 삼각행렬을 만들고 대각 성분을 곱하면 det가 된다.

- 행 교환 → 교환할 때마다 부호 반전
- 한 행을 다른 행에 더함 → 변화 없음
- 한 행에 상수를 곱함 → det도 그만큼 곱해짐 (나중에 보정)

</div>

> 예 : 위의 $A$에서 $R_2\leftarrow R_2-3R_1$을 하면 $\begin{bmatrix}1&2&3\\0&-5&-7\\0&0&1\end{bmatrix}$. 삼각행렬이고 더하기 연산만 썼으므로 $\det(A)=1\cdot(-5)\cdot1=-5$.

※ 교재 밖 보충(일반적 사실) : Laplace 전개를 그대로 재귀하면 항의 수가 $n!$ 꼴로 폭발하지만, 가우스 소거는 연산량이 $n^3$ 꼴이다.

</details>

<details>

<summary><strong>5) Determinant와 Rank</strong></summary>

> <strong>Theorem 4.3</strong> $\det(A)\neq0\iff\text{rank}(A)=n$. 즉 A가 invertible $\iff$ full rank.
직관 : $\det\neq0$이면 평행육면체가 $n$차원으로 살아 있으므로 열벡터 $n$개가 서로 독립이고, 따라서 rank가 $n$이다.

</details>

<details>

<summary><strong>이걸 모르면?</strong></summary>

- 가우스 소거로 det 계산
- 특성다항식 · 고유값 (4.2)
- 닮음 변환에서 변하지 않는 양
- 이해 어려움

</details>

<div class="callout" role="note" data-kind="stuck">

<strong>막힐 가능성이 높은 지점</strong>

1. <strong>Laplace의 인덱스.</strong> $(4.12)$는 $a_{kj}$, $(4.13)$은 $a_{jk}$로 쓰여서 헷갈린다. $j$는 고정, $k$가 움직인다.
1. $\det(A+B)\neq\det(A)+\det(B)$<strong>.</strong> det는 행렬 전체에 대해 선형이 아니다. (각 열에 대해서만 선형)
1. $\det(\lambda A)=\lambda^n\det(A)$<strong>.</strong> $\lambda$배가 아니라 $\lambda^n$배이다.
1. 삼각화 중 "행에 상수를 곱하면 det도 그만큼 곱해진다"를 잊어서 값이 틀어진다.
1. 삼각화 중 <strong>행 교환 횟수</strong>를 세지 않아 부호가 틀어진다.

</div>

<details>

<summary><strong>문제</strong></summary>

[Untitled](https://app.notion.com/p/3f409d87213b81abaa3bc8ea427084e1)

[Untitled](https://app.notion.com/p/3f409d87213b8143b9afeb98a81d1406)

</details>
