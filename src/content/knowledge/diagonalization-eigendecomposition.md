---
title: "Diagonalization & Eigendecomposition"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/matrix-decompositions
status: seed
order: 2
---

<div class="callout" role="note" data-kind="note">

<strong>이어받는 질문</strong> : Spectral Theorem은 <strong>대칭</strong>행렬이면 고유벡터로 정규직교 기저를 잡을 수 있다고 했다. 대칭이 아닌 일반 정사각행렬은 고유벡터 기저로 $D=P^{-1}AP$ 꼴의 대각행렬을 만들 수 있는가?

<strong>핵심 아이디어</strong> : 한 줄 $AP=PD$가 전부이다. 열 단위로 읽으면 $Ap_i=\lambda_ip_i$이므로, “$P$의 열이 고유벡터”이고 “$P$가 가역(독립인 열 $n$개)”이면 대각화된다. 대칭이면 이 $P$를 직교로 잡을 수 있어 $P^{-1}=P^\top$이 되지만(Spectral Theorem), 일반 행렬은 세 가지를 잃는다 : 고유값이 실수라는 보장, 고유벡터가 직교한다는 보장, 독립 고유벡터가 $n$개라는 보장(defective).

</div>

> 정사각행렬 $A$가 대각행렬 $D$와 <strong>닮았을 때</strong>($D=P^{-1}AP$) $A$를 <strong>diagonalizable(대각화 가능)</strong> 이라 한다. 이때 $A=PDP^{-1}$이 <strong>eigendecomposition</strong>이다.
$D$<strong>의 대각 성분 = 고유값, </strong>$P$<strong>의 열 = 대응하는 고유벡터.</strong>
<strong>Theorem 4.20</strong> $A=PDP^{-1}$로 분해된다 $\iff$ $A$의 고유벡터들이 $\mathbb{R}^n$의 <strong>기저</strong>를 이룬다.

<details>

<summary><strong>배경지식 (0에서 시작)</strong></summary>

<details>

<summary>① 대각행렬이 좋은 이유 (교재 (4.49))</summary>

> $D=\text{diag}(c_1,\dots,c_n)$이면
• $\det(D)=\prod c_i$
• $D^k=\text{diag}(c_1^k,\dots,c_n^k)$ : 각 성분을 따로 거듭제곱하면 끝
• $D^{-1}=\text{diag}(1/c_1,\dots,1/c_n)$ : 모든 $c_i\neq0$일 때

</details>

<details>

<summary>② 닮음과 기저변환 (2.7.2 복습)</summary>

> 같은 선형사상을 다른 기저에서 본 행렬 $\tilde A=S^{-1}AS$. 일반 공식은 $\tilde A_\Phi=T^{-1}A_\Phi S$이고, <strong>입력 기저와 출력 기저가 같으면 </strong>$S=T$가 되어 $S^{-1}AS$가 된다.
대각화는 이 공식에서 “$S$로 어떤 기저를 고르면 $\tilde A$가 대각이 되는가”를 묻는 것이다.

</details>

<details>

<summary>③ 행렬곱을 열 단위로 읽기</summary>

> $AP=A[p_1\cdots p_n]=[Ap_1\;\cdots\;Ap_n]$ : $A$를 곱하면 $P$의 <strong>각 열에</strong> $A$가 곱해진다.
$PD=[p_1\cdots p_n]\,\text{diag}(\lambda_1,\dots,\lambda_n)=[\lambda_1p_1\;\cdots\;\lambda_np_n]$ : 오른쪽에서 대각행렬을 곱하면 <strong>각 열이 </strong>$\lambda_i$<strong>배</strong>가 된다.

</details>

<details>

<summary>④ 4.2 복습</summary>

> 서로 다른 고유값의 고유벡터는 독립(Theorem 4.12). 독립 고유벡터가 $n$개보다 적은 행렬이 defective. 대칭이면 정규직교 고유기저가 있다(Spectral Theorem).

</details>

</details>

<details>

<summary><strong>왜 필요한가</strong></summary>

> <strong>원인 → 결과 사슬</strong>
1. 대각행렬 $D$는 거듭제곱·역·det가 한 줄이다.
2. $A$와 $D$가 <strong>같은 선형사상의 다른 좌표 표현</strong>이라면, $A$ 대신 $D$로 계산하고 좌표만 바꿔 오면 된다.
3. 그런 좌표(기저)가 존재하는가? → <strong>고유벡터로 기저를 잡을 수 있으면 존재한다.</strong>
4. 그러면 “어떤 $A$가 그런 기저를 가지는가?”가 질문이 되고, 답이 Theorem 4.20이다.

</details>

<details>

<summary>$AP=PD$<strong> : 대각화의 핵심 한 줄</strong></summary>

> 열 단위로 비교하면 $AP=PD$는 곧 $Ap_1=\lambda_1p_1,\;\dots,\;Ap_n=\lambda_np_n$이다.
즉 $AP=PD$<strong> </strong>$\iff$<strong> </strong>$\lambda_i$<strong>는 고유값이고 </strong>$p_i$<strong>는 대응하는 고유벡터</strong>이다.

<details>

<summary>왜 “$\iff$” 인가 (Theorem 4.20 두 방향)</summary>

> ($\Leftarrow$) 고유벡터 $n$개가 기저이면 그것을 열로 모은 $P$는 열이 독립이라 invertible(full rank, Theorem 4.3). $AP=PD$의 양변에 $P^{-1}$을 곱하면 $A=PDP^{-1}$.
($\Rightarrow$) $A=PDP^{-1}$이면 $AP=PD$이므로 $P$의 열이 고유벡터이다. $P$가 invertible이므로 이 $n$개 열은 독립이고, 따라서 기저이다.

</details>

</details>

<details>

<summary><strong>대각화 가능 여부 판정</strong></summary>

| 상황 | 대각화 | 이유 |
| --- | --- | --- |
| 독립 고유벡터가 $n$개 나온다 (4.2 “경우 나누기” : 고유값이 모두 다르거나 GM = AM) | 가능 | Theorem 4.20 : 그 $n$개를 열로 모은 $P$가 가역 |
| $n$개에 못 미친다 (defective) | <strong>불가능</strong> | $P$를 가역으로 만들 열이 모자람 |
| 대칭행렬 | <strong>항상 가능</strong> | Spectral Theorem. 게다가 $P$를 직교행렬로 잡을 수 있어 $D=P^\top AP$ (Theorem 4.21) |

<div class="callout" role="note" data-kind="intuition">

<strong>대각화 가능 </strong>$\iff$<strong> non-defective.</strong> (교재 : defective 행렬은 대각화할 수 없다.)
대각화가 안 되는 행렬을 위한 대안으로 Jordan normal form이 있지만 교재 범위 밖이다.

</div>

</details>

<details>

<summary><strong>예시</strong></summary>

<details>

<summary>① 대각화 가능 : 교재 Example 4.5의 행렬</summary>

> $A=\begin{bmatrix}4&2\\1&3\end{bmatrix}$, 고유쌍 $(5,\,(2,1)^\top)$, $(2,\,(1,-1)^\top)$
$P=\begin{bmatrix}2&1\\1&-1\end{bmatrix}$, $D=\begin{bmatrix}5&0\\0&2\end{bmatrix}$
검산 $AP=PD$ : $AP$의 1열 $=A(2,1)^\top=(10,5)^\top=5\cdot(2,1)^\top$ = $PD$의 1열 ✓, 2열 $=A(1,-1)^\top=(2,-2)^\top=2\cdot(1,-1)^\top$ = $PD$의 2열 ✓
$\det(P)=-3\neq0$이므로 $P$는 invertible. 따라서 $A=PDP^{-1}$.

</details>

<details>

<summary>② 대각화 불가능 : 교재 Example 4.6의 행렬</summary>

> $A=\begin{bmatrix}2&1\\0&2\end{bmatrix}$ : 고유값 $2$(algebraic 2), 독립 고유벡터는 $(1,0)^\top$ 하나뿐(geometric 1).
$P$의 열로 쓸 독립 고유벡터가 2개 모자라서 invertible인 $P$를 만들 수 없다.

</details>

<details>

<summary>③ 대칭이라 항상 가능 : 아래 Example 4.11</summary>

> 다음 노트에서 계산한다.

</details>

</details>

<details>

<summary><strong>이걸 모르면?</strong></summary>

- $A^k$ 계산, 안정성 분석
- SVD (4.5) : 대각화의 일반화
- PCA (10장) : 공분산행렬의 대각화
- 이해 어려움

</details>

<div class="callout" role="note" data-kind="stuck">

<strong>막힐 가능성이 높은 지점</strong>

1. $P$<strong>의 열 순서와 </strong>$D$<strong>의 대각 순서는 대응해야 한다.</strong> $p_i$를 $i$번째 열에 두었으면 $\lambda_i$도 $D$의 $i$번째 대각에 둔다. 순서를 바꿔도 되지만 둘이 같이 바뀌어야 한다.
1. $A=PDP^{-1}$<strong>에서 </strong>$P^{-1}$<strong>의 위치.</strong> 오른쪽부터 읽는다. 먼저 $P^{-1}$이 표준 좌표를 고유기저 좌표로 바꾸고, $D$가 늘이고, $P$가 돌려놓는다. (다음 노트)
1. <strong>고유벡터를 정규화할 필요는 없다.</strong> $P$가 invertible이기만 하면 된다. 정규직교로 만드는 이유는 대칭일 때 $P^{-1}=P^\top$을 쓰려는 것이다.
1. <strong>“서로 다른 고유값 </strong>$n$<strong>개 </strong>$\Rightarrow$<strong> 대각화 가능”은 충분조건이지 필요조건이 아니다.</strong> 항등행렬은 고유값이 중복이지만 대각화 가능하다.
1. <strong>대각화 가능과 가역은 서로 무관하다.</strong> (아래 4가지 조합 참고)
1. ※ 교재 밖 보충 : 실수 행렬로 대각화하려면 실수 고유벡터 $n$개가 필요하다. 회전행렬은 실수 위에서는 대각화되지 않는다. (복소수까지 허용하면 가능하다.)

</div>

<div class="callout" role="note" data-kind="note">

<strong>풀린 것</strong> : 대각화 가능 $\iff$ 독립인 고유벡터가 $n$개 ($AP=PD$). 서로 다른 고유값이 $n$개이면 충분하고, defective이면 불가능하다.

<strong>남은 것 → 다음 노트</strong> : 대각화가 가능할 때 그 식은 실제로 무엇을 하고, 어떤 계산을 쉽게 만드는가?

</div>
