---
title: "Cholesky Decomposition"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/matrix-decompositions
status: seed
order: 1
---

<div class="callout" role="note" data-kind="note">

<strong>이어받는 질문</strong> : 고유벡터와 고윳값을 이용하면 대칭행렬을 분해할 수 있다. 하지만 머신러닝에서 행렬을 사용하는 목적은 고유벡터를 구하는 것 자체가 아니라, 데이터를 생성하거나 방정식을 푸는 등 필요한 계산을 수행하는 것이다. 그렇다면 이러한 계산에 더 효율적인 행렬 분해 방법은 무엇일까?

<strong>핵심 아이디어</strong> : 양수 $a$를 $\sqrt a\cdot\sqrt a$로 쪼개듯, SPD 행렬을 하삼각행렬과 그 전치의 곱 $A=LL^\top$으로 쪼갠다. $L$의 성분은 앞에서부터 하나씩, 이미 구한 값만으로 정해진다. (고유값 문제를 풀지 않는다.) 양의 정부호는 이 과정에서 제곱근 안이 항상 양수가 되도록 보장한다.

</div>

> <strong>Theorem 4.18</strong> 대칭 양의 정부호(SPD) 행렬 $A$는 $A=LL^\top$으로 분해된다. $L$은 <strong>대각 성분이 양수인 하삼각행렬</strong>이고, 이런 $L$은 <strong>유일</strong>하다. ($L$을 Cholesky factor라 부른다.)
숫자에서 $9=3\cdot3$으로 “제곱근”을 뽑듯, <strong>SPD 행렬의 제곱근에 해당하는 연산</strong>이다.

<details>

<summary><strong>배경지식 (0에서 시작)</strong></summary>

<details>

<summary>① SPD 복습 (3장)</summary>

> $A=A^\top$(Symmetric)이고 $x\neq0\Rightarrow x^\top Ax>0$.
3장에서 “내적을 행렬로 표현할 때 $A$가 반드시 가져야 하는 조건”으로 만났다. 공분산행렬도 이 부류이다. (6장)

</details>

<details>

<summary>② 하삼각행렬 (4.1 복습)</summary>

> 대각선 위가 전부 0인 행렬. 4.1에서 $\det(T)=\prod T_{ii}$를 봤다. 하삼각행렬을 쓰는 이유는 계산이 쉽기 때문이다.

</details>

<details>

<summary>③ 제곱근과 인수분해의 비유</summary>

> 양수 $a$는 $a=\sqrt a\cdot\sqrt a$로 쪼갤 수 있다. 행렬 분해(matrix factorization)는 <strong>행렬을 해석하기 쉬운 인수들의 곱으로 쪼개는 것</strong>이다. (교재 4장 서두)
$LL^\top$은 “$L$ 곱하기 $L$의 전치”이므로 $\sqrt a\cdot\sqrt a$의 행렬 버전이다.

</details>

<details>

<summary>④ $LL^\top$의 성분</summary>

> 여기서 $A$의 $i$행 $j$열에 있는 원소를 구하려면, $L$의 $i$행과 $L^\top$의 $j$열을 곱해서 더하면 된다.
그런데 $L^\top$의 $j$열은 원래 $L$의 $j$행을 세로로 세운 것과 같다.
즉, $L$의 $i$행과 $j$행의 내적이다.

<details>

<summary>$(LL^\top)_{ij}=\sum_k l_{ik}l_{jk}$</summary>

> $i$: 첫 번째로 선택한 행의 번호
$j$: 두 번째로 선택한 행의 번호
$k$: 두 행에서 몇 번째 원소끼리 곱할지 나타내는 번호

> $L$이 하삼각이므로 $k\le\min(i,j)$인 항만 남는다.

</details>

</details>

</details>

<details>

<summary><strong>왜 필요한가</strong></summary>

> <strong>ML에서는 SPD 행렬(공분산, 커널, 헤시안 근사)을 계속 다룬다.</strong> 이 행렬을 삼각행렬 곱으로 바꿔 두면 아래 일들이 한꺼번에 쉬워진다.

<strong>원인 → 결과 사슬</strong>

1. <strong>가우시안에서 표본 뽑기</strong> : 공분산 $\Sigma=LL^\top$이면, 표준정규 $z\sim\mathcal N(0,I)$로 $x=\mu+Lz$를 만들면 $\text{Cov}(x)=L\,I\,L^\top=\Sigma$이다.
2. <strong>Reparametrization trick</strong> : 표본이 $\mu+Lz$ 꼴이면 $\mu,L$로 미분할 수 있다. 교재 Further Reading에 따르면 VAE에서 이 미분을 가능하게 하는 것이 Cholesky이다.
3. <strong>det를 싸게 계산</strong> : $\det(A)=\det(L)\det(L^\top)=\det(L)^2=\prod_i l_{ii}^2$. $L$이 삼각이라 대각곱만 하면 된다. (교재 본문)

</details>

<details>

<summary><strong>직관</strong></summary>

<details>

<summary>$1\times1$에서 시작</summary>

> $A=[a]$이면 $L=[\sqrt a]$이고 $LL^\top=a$이다. 제곱근이 실수로 존재하려면 $a>0$이어야 한다. <strong>이 “양수여야 한다”가 행렬에서는 “양의 정부호여야 한다”가 된다.</strong>

</details>

<details>

<summary>왜 양의 정부호가 필요한가 (필요성 쪽)</summary>

> $A=LL^\top$이고 $L$이 invertible(대각 성분이 양수인 하삼각)이면
$x^\top Ax=x^\top LL^\top x=(L^\top x)^\top(L^\top x)=\Vert{}L^\top x\Vert{}^2>0\;(x\neq0)$
따라서 $A$는 대칭이고 양의 정부호이다. 반대로, 이 조건을 만족하는 $A$만이 $LL^\top$으로 쓰인다는 것이 Theorem 4.18이다.

</details>

<details>

<summary>가우시안에서의 의미 (기하)</summary>

> $z$의 분포는 공 모양(등방)이다. $L$은 이 공을 <strong>늘이고 기울여서</strong> 공분산 $\Sigma$를 가진 타원 모양으로 바꾸는 선형사상이다. $\mu$는 위치를 옮긴다.

</details>

</details>

<details>

<summary><strong>유도 : 성분을 앞에서부터 하나씩 결정 (교재 Example 4.10)</strong></summary>

> $3\times3$에서 $A=LL^\top$을 성분으로 풀어 쓰면
$a_{11}=l_{11}^2$, $a_{21}=l_{21}l_{11}$, $a_{31}=l_{31}l_{11}$
$a_{22}=l_{21}^2+l_{22}^2$, $a_{32}=l_{31}l_{21}+l_{32}l_{22}$, $a_{33}=l_{31}^2+l_{32}^2+l_{33}^2$

> 이 식들을 <strong>이미 구한 값으로 앞에서부터</strong> 풀 수 있다.
대각 : $l_{11}=\sqrt{a_{11}}$, $l_{22}=\sqrt{a_{22}-l_{21}^2}$, $l_{33}=\sqrt{a_{33}-(l_{31}^2+l_{32}^2)}$
대각 아래 : $l_{21}=\dfrac{a_{21}}{l_{11}}$, $l_{31}=\dfrac{a_{31}}{l_{11}}$, $l_{32}=\dfrac{1}{l_{22}}(a_{32}-l_{31}l_{21})$

<div class="callout" role="note" data-kind="intuition">

<strong>핵심 : 새로 구하는 성분은 항상 “이미 구한 성분”만으로 계산된다.</strong> $l_{11}\to l_{21},l_{31}\to l_{22}\to l_{32}\to l_{33}$ 순서이다.
제곱근 안의 값이 양수가 되는 것을 보장해 주는 것이 양의 정부호 조건이다.

</div>

</details>

<details>

<summary><strong>예시</strong></summary>

<details>

<summary>① $3\times3$ 숫자 계산</summary>

> $A=\begin{bmatrix}4&2&2\\2&5&3\\2&3&6\end{bmatrix}$
$l_{11}=\sqrt4=2$, $l_{21}=2/2=1$, $l_{31}=2/2=1$
$l_{22}=\sqrt{5-1^2}=2$, $l_{32}=\dfrac{1}{2}(3-1\cdot1)=1$
$l_{33}=\sqrt{6-(1^2+1^2)}=2$
$L=\begin{bmatrix}2&0&0\\1&2&0\\1&1&2\end{bmatrix}$

> 검산 : $LL^\top$의 (1,1)=$4$, (1,2)=$2$, (1,3)=$2$, (2,2)=$1+4=5$, (2,3)=$1+2=3$, (3,3)=$1+1+4=6$ → $A$와 일치 ✓
det : $\det(A)=(2\cdot2\cdot2)^2=64$. (직접 계산해도 $64$)

</details>

<details>

<summary>② 가우시안 표본 만들기</summary>

> $\Sigma=\begin{bmatrix}4&2\\2&3\end{bmatrix}$ : $l_{11}=2$, $l_{21}=1$, $l_{22}=\sqrt{3-1}=\sqrt2$ → $L=\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix}$
$x-\mu=Lz=(2z_1,\;z_1+\sqrt2z_2)$
• $\text{Var}(x_1)=2^2\cdot1=4$ ✓
• $\text{Cov}(x_1,x_2)=2\cdot1\cdot1=2$ ✓
• $\text{Var}(x_2)=1^2+(\sqrt2)^2=3$ ✓
$z_1,z_2$는 독립이고 분산이 1이므로, 공분산의 각 성분이 정확히 $\Sigma$의 성분과 일치한다.

</details>

<details>

<summary>③ 실패하는 경우 : 대칭이지만 PD가 아니다</summary>

> $A=\begin{bmatrix}1&2\\2&1\end{bmatrix}$ : $l_{11}=1$, $l_{21}=2$, $l_{22}=\sqrt{1-4}=\sqrt{-3}$ → 실수 해가 없다.
고유값이 $3,-1$로 하나가 음수이기 때문이다. (고유값이 전부 양수여야 PD이다 — 4.2의 성질)

</details>

</details>

<details>

<summary><strong>이걸 모르면?</strong></summary>

- 다변량 가우시안 표본 추출 (6장)
- Reparametrization trick · VAE
- 공분산·커널 행렬을 안정적으로 다루는 방법 (로그 우도의 $\log\det\Sigma$ 등)
- 이해 어려움

</details>

<details>

<summary><strong>추가정보</strong></summary>

- 교재는 Cholesky가 “확률적 사건을 계산하거나 시뮬레이션할 때 자주 다시 나타난다”고 소개한다. (Further Reading)
- ※ 교재 밖 보충(일반적 사실) : $Ax=b$를 풀 때 $A=LL^\top$이면 $Ly=b$를 앞에서부터, $L^\top x=y$를 뒤에서부터 풀면 된다. 삼각행렬이라 각각 쉽다.
- ※ 교재 밖 보충 : $\log\det\Sigma=2\sum_i\log l_{ii}$. det 공식을 그대로 이용한다.

</details>

<div class="callout" role="note" data-kind="stuck">

<strong>막힐 가능성이 높은 지점</strong>

1. <strong>방향 혼동.</strong> $A=LL^\top$이고 $L$은 <strong>하삼각</strong>이다. 책에 따라 상삼각 $R$을 써서 $A=R^\top R$로 쓰기도 한다.
1. <strong>“제곱근”이라고 해서 </strong>$A^{1/2}$<strong>과 같은 것은 아니다.</strong> 3장에서 본 대칭 제곱근 $A^{1/2}=PD^{1/2}P^\top$ (4.2의 Spectral Theorem)과 $L$은 <strong>서로 다른 인수</strong>이다. 곱하면 $A$가 된다는 점만 같다.
1. <strong>대각 성분이 양수여야 유일하다.</strong> 부호를 허용하면 $l_{ii}$의 부호를 바꾼 다른 $L$이 생긴다.
1. <strong>대칭이면 되는 것이 아니라 양의 정부호여야 한다.</strong> 제곱근 안이 음수가 되면 PD가 아니다. (예시 ③)
1. $\mu+Lz$<strong>에서 </strong>$z$<strong>의 공분산이 단위행렬이어야 한다.</strong> $L$이 공분산을 만들어 내는 것은 $\text{Cov}(z)=I$ 덕분이다.

</div>

<div class="callout" role="note" data-kind="note">

<strong>풀린 것</strong> : SPD 행렬은 $A=LL^\top$으로 싸게 쪼갤 수 있고, $\det(A)=\prod_i l_{ii}^2$, 가우시안 표본 $x=\mu+Lz$가 한 줄로 나온다.

<strong>남은 것 → 다음 노트</strong> : Cholesky는 SPD 전용이다. 대칭이 아니거나 PD가 아닌 일반 정사각행렬은 어떻게 쪼개는가? 고유벡터로 기저를 잡아 대각행렬로 만드는 방법은 어떤 행렬에서 되고, 어떤 행렬에서 안 되는가?

</div>
