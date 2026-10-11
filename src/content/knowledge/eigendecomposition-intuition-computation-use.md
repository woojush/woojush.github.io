---
title: "고유분해의 직관 · 계산 · 활용"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/matrix-decompositions
status: seed
order: 3
---

<div class="callout" role="note" data-kind="note">

<strong>이어받는 질문</strong> : $A=PDP^{-1}$이 존재함은 알았다. 이 식은 기하적으로 무엇을 하며, 어떤 계산을 쉽게 해 주는가?

<strong>핵심 아이디어</strong> : $A=PDP^{-1}$을 오른쪽부터 읽으면 “좌표 바꾸기 → 축별 늘이기 → 되돌리기”이다. 가운데 $D$만 대각행렬이라 거듭제곡할 때 이웃한 $P^{-1}P$가 소거되어 $A^k=PD^kP^{-1}$이 된다.

</div>

> $A=PDP^{-1}$을 <strong>오른쪽부터</strong> 읽으면 세 단계이다.
<strong>① </strong>$P^{-1}$<strong> : 표준 좌표 </strong>$\to$<strong> 고유기저 좌표 ② </strong>$D$<strong> : 각 축을 </strong>$\lambda_i$<strong>배 ③ </strong>$P$<strong> : 다시 표준 좌표로</strong>

<details>

<summary><strong>기하학적 직관 (교재 Figure 4.7)</strong></summary>

> $A$는 표준기저 기준의 변환행렬이다.
① $P^{-1}$ : 표준기저 $e_i$에서 고유기저 $p_i$로 <strong>기저변환</strong>한다. (좌표 읽는 방식만 바뀌고 벡터는 그대로)
② $D$ : 고유기저의 좌표에서는 변환이 단순한 축 늘임이다. 고유벡터 방향으로 $\lambda_i$배.
③ $P$ : 늘어난 결과를 다시 표준기저 좌표로 돌려놓는다. 결과는 $\lambda_ip_i$.

<div class="callout" role="note" data-kind="intuition">

이것은 2장 기저변환의 $\tilde A_\Phi=T^{-1}A_\Phi S$에서 $S=T=P$인 경우이다. “기저 $\tilde B$ 좌표 $\to$ $B$ 좌표 $\to$ $A$ 적용 $\to$ 다시 $\tilde B$ 좌표”를 고유기저로 한 번 해 본 것이다.

</div>

</details>

<details>

<summary><strong>예시 : 교재 Example 4.11 (대칭행렬의 고유분해)</strong></summary>

> $A=\dfrac12\begin{bmatrix}5&-2\\-2&5\end{bmatrix}$

<details>

<summary>Step 1. 고유값과 고유벡터</summary>

> $p_A(\lambda)=\big(\tfrac52-\lambda\big)^2-1=\lambda^2-5\lambda+\tfrac{21}{4}=\big(\lambda-\tfrac72\big)\big(\lambda-\tfrac32\big)$
$\lambda_1=\tfrac72,\;\lambda_2=\tfrac32$
정규화된 고유벡터 : $p_1=\dfrac{1}{\sqrt2}\begin{bmatrix}1\\-1\end{bmatrix},\;p_2=\dfrac{1}{\sqrt2}\begin{bmatrix}1\\1\end{bmatrix}$
검산 : $A(1,-1)^\top=\tfrac12(7,-7)^\top=\tfrac72(1,-1)^\top$ ✓, $A(1,1)^\top=\tfrac12(3,3)^\top=\tfrac32(1,1)^\top$ ✓

</details>

<details>

<summary>Step 2. 존재 확인</summary>

> 고유값이 서로 다르므로 $p_1,p_2$는 독립이고 $\mathbb{R}^2$의 기저이다. 게다가 대칭이라 서로 직교한다. 따라서 대각화 가능하다.

</details>

<details>

<summary>Step 3. $P$와 $D$</summary>

> $P=[p_1\;p_2]=\dfrac{1}{\sqrt2}\begin{bmatrix}1&1\\-1&1\end{bmatrix}$, $D=\begin{bmatrix}\tfrac72&0\\0&\tfrac32\end{bmatrix}$
$P$의 열이 정규직교이므로 $P^{-1}=P^\top$이다. 따라서
$A=PDP^\top=\dfrac{1}{\sqrt2}\begin{bmatrix}1&1\\-1&1\end{bmatrix}\begin{bmatrix}\tfrac72&0\\0&\tfrac32\end{bmatrix}\dfrac{1}{\sqrt2}\begin{bmatrix}1&-1\\1&1\end{bmatrix}$

</details>

</details>

<details>

<summary><strong>활용 1 : 거듭제곡 </strong>$A^k=PD^kP^{-1}$</summary>

> $A^k=(PDP^{-1})(PDP^{-1})\cdots(PDP^{-1})$에서 이웃한 $P^{-1}P$가 모두 $I$로 지워지므로 $A^k=PD^kP^{-1}$.
$D^k$는 대각 성분을 각각 $k$제곱하면 된다.

<details>

<summary>예시 : Example 4.11의 $A^2$</summary>

> $D^2=\text{diag}\big(\tfrac{49}{4},\tfrac94\big)$이므로 $A^2=\tfrac{49}{4}\,p_1p_1^\top+\tfrac94\,p_2p_2^\top$.
$p_1p_1^\top=\tfrac12\begin{bmatrix}1&-1\\-1&1\end{bmatrix}$, $p_2p_2^\top=\tfrac12\begin{bmatrix}1&1\\1&1\end{bmatrix}$
$A^2=\tfrac{49}{8}\begin{bmatrix}1&-1\\-1&1\end{bmatrix}+\tfrac98\begin{bmatrix}1&1\\1&1\end{bmatrix}=\begin{bmatrix}\tfrac{29}{4}&-5\\-5&\tfrac{29}{4}\end{bmatrix}$
직접 곱한 $A^2=\tfrac14\begin{bmatrix}29&-20\\-20&29\end{bmatrix}$와 같다. ✓

</details>

</details>

<details>

<summary><strong>활용 2 : det와 역행렬</strong></summary>

> $\det(A)=\det(P)\det(D)\det(P^{-1})=\det(D)=\prod_id_{ii}$ (교재 (4.63)). 4.2의 Theorem 4.16과 같은 결론이다.
$A^{-1}=PD^{-1}P^{-1}$ (모든 $\lambda_i\neq0$일 때). $D^{-1}$은 대각 성분의 역수이다.
Example 4.11 : $\det(A)=\tfrac72\cdot\tfrac32=\tfrac{21}{4}$. 직접 계산하면 $\tfrac14(25-4)=\tfrac{21}{4}$ ✓

</details>

<details>

<summary><strong>대각화 가능 여부와 가역성은 무관하다 (4가지 조합)</strong></summary>

|  | 가역 (모든 $\lambda\neq0$) | 가역 아님 ($\lambda=0$ 존재) |
| --- | --- | --- |
| <strong>대각화 가능</strong> | $\begin{bmatrix}4&2\\1&3\end{bmatrix}$ (고유값 $2,5$) | $\begin{bmatrix}1&1\\1&1\end{bmatrix}$ (고유값 $0,2$, 대칭) |
| <strong>대각화 불가능</strong> | $\begin{bmatrix}2&1\\0&2\end{bmatrix}$ ($\det=4$, defective) | $\begin{bmatrix}1&-1\\1&-1\end{bmatrix}$ (고유값 $0$이 2번, 고유공간은 1차원) |

> 가역성은 <strong>고유값이 0인가</strong>의 문제이고, 대각화 가능성은 <strong>고유벡터가 충분한가</strong>의 문제이다. 서로 다른 질문이다.

</details>

<details>

<summary><strong>한계와 다음 노트</strong></summary>

> 고유분해는 <strong>정사각행렬</strong>에 대해서만 정의되고, 그중에서도 <strong>non-defective</strong>여야 한다.
그런데 데이터 행렬은 보통 직사각형이다. (행 = 샘플, 열 = 특징) → <strong>어떤 행렬에도 존재하는 분해가 필요하다 → SVD (4.5)</strong>

</details>

<details>

<summary><strong>AI Engineering Relevance</strong></summary>

<div class="callout" role="note" data-kind="intuition">



- <strong>좌표계 변환</strong> : Further Reading에 따르면 고유벡터는 데이터를 “의미 있는 직교 특징 벡터의 좌표”로 바꾸는 기저변환에 쓰인다. PCA(10장)가 그 예이다.
• <strong>반복 곱의 거동</strong> : $A^kx=PD^kP^{-1}x$이므로 (대각화 가능한 경우) 모든 $|\lambda_i|<1$이면 $A^kx\to0$, 어떤 $|\lambda_i|>1$이면 해당 성분이 커진다. 앞의 PageRank 예시가 이 구조이다.

</div>

</details>

<details>

<summary><strong>이걸 모르면?</strong></summary>

- SVD (4.5), 행렬 근사 (4.6)
- PCA (10장)
- 이해 어려움

</details>

<div class="callout" role="note" data-kind="stuck">

<strong>막힐 가능성이 높은 지점</strong>

1. $A^k=PD^kP^{-1}$<strong>에서 </strong>$P^{-1}$<strong>이 사라지지 않는 이유.</strong> 가운데는 지워지지만 양 끝의 $P$와 $P^{-1}$은 남는다.
1. $PDP^\top$<strong>와 </strong>$PDP^{-1}$<strong>의 구분.</strong> $P$가 직교행렬일 때(대칭행렬의 정규직교 고유기저)만 $P^{-1}=P^\top$이다.
1. <strong>고유분해는 직사각행렬에 못 쓴다.</strong> $\det$처럼 정사각에서만 의미가 있다.
1. $A^{-1}=PD^{-1}P^{-1}$<strong>은 모든 </strong>$\lambda_i\neq0$<strong>일 때만 쓴다.</strong> 대각화 가능해도 고유값 0이 있으면 역행렬이 없다. (아래 4가지 조합 표)

</div>

<details>

<summary><strong>문제</strong></summary>

[Untitled](https://app.notion.com/p/3f409d87213b81f8ac15f8b48d800ba4)

[Untitled](https://app.notion.com/p/3f409d87213b81b38f14db8037139a4d)

[Untitled](https://app.notion.com/p/3f409d87213b81458180d1585285e77e)

</details>

<div class="callout" role="note" data-kind="note">

<strong>풀린 것</strong> : 정사각이고 non-defective인 행렬은 $A=PDP^{-1}$로 쓰고, $A^k$, det, 역행렬을 쉽게 구한다.

<strong>남은 것 → 다음 노트</strong> : (1) 정사각이 아닌 $m\times n$ 행렬(데이터 행렬)은 고유값이 정의되지 않는다. (2) 정사각이어도 defective이면 안 되고, $P$가 직교가 아니면 “회전 + 늘임”으로 읽기 어렵다. 어떤 행렬에나 통하는 분해는 없는가?

</div>
