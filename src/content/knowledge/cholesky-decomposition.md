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

<summary>$a_{ij}=(LL^\top)_{ij}=\sum_k l_{ik}l_{jk}$</summary>

> $i$: 첫 번째로 선택한 행의 번호
$j$: 두 번째로 선택한 행의 번호
$k$: 열의 번호

>
>
> A가 3×3 행렬이라고 하자. a32는 L의 3행과 2행의 내적이다.
>
> 즉,
>
> a32=l31l21+l32l22+l33l23
>
> 이때 L이 하삼각행렬이므로 l23=0이다. 따라서 k&gt;min⁡(3,2)=2인 k=3의 항 l33l23은 0이 되어 사라진다.
>
> 결국
>
> a32=l31l21+l32l22
>
> 이처럼 k≤min⁡(i,j)인 항만 남는다.

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

<details>

<summary><strong>위 세 줄이 막막하다면 : 숫자 예시로 풀어 쓰기 (0에서 시작)</strong></summary>

> 위 세 줄은 가우시안, 공분산, 표준정규분포, VAE를 이미 안다고 가정하고 쓴 요약이다. 여기서는 이 개념들이 <strong>어떤 문제를 풀려고 등장했는지</strong>부터 숫자 예시로 풀어 본다. 확률과 통계를 몰라도 따라올 수 있게 썼다.

<details>

<summary><strong>용어 먼저 : 가우시안, 공분산, 표준정규분포</strong></summary>

> <strong>가우시안(Gaussian) = 정규분포(Normal distribution)
</strong>값이 평균 근처에 많이 모이고, 평균에서 멀어질수록 드물게 나오는 분포이다.
예) 시험 점수가 평균 70점, 표준편차 10점인 분포에서 학생 한 명을 뽑으면 70점 근처가 나올 가능성이 높고, 30점이나 100점은 드물다.
<strong>"표본을 뽑는다" = 이 분포를 따르는 임의의 값 하나를 생성한다</strong>는 뜻이다.

> <strong>변수가 여러 개인 분포 = 다변량 가우시안 (multiviate Gaussian)</strong>
>
> 다변량 가우시안이 만들어지기 위해서는 각 변수의 평균과 분산이 필요하며, 해당 변수들이 서로 어떤 관계를 갖는지가 필요하다. 이 관계를 수치로 표현한 것이 <strong>공분산</strong>이다.
>
> 여기서 <strong>분산은 하나의 변수가 그 자체의 평균으로부터 얼마나 넓게 퍼져 있는지(산포도)를 나타내는 지표</strong>다. 즉, 공분산이 두 변수 사이의 관계를 보여준다면, 분산은 개별 변수가 가진 고유의 변동성의 크기를 의미한다.
>
> 분산과 공분산을 행렬에 담아내고, 그것을 공분산 행렬이라 한다.
>
> 그리고 평균과 공분산 행렬을 통해 다변량 가우시안 분포를 만들고, 컴퓨터는 해당 분포도에 무작위로 점을 찍어 새로운 사람의 데이터를 추출한다.
>
> - <strong>최종 결과</strong>: 분포 자체가 이미 두 변수의 관계(공분산)를 반영하고 있으므로, 새로 생성된 가상 인물들도 <strong>"키가 크면 몸무게도 많이 나가는" 자연스러운 관계를 유지</strong>하며 태어나게 됩니다.
>
> ---

> <strong>표준정규분포 = 평균 0, 분산 1인 정규분포</strong>, 기호로 $\mathcal N(0,1)$이다. 서로 독립인 표준정규 난수 $z_1,z_2$를 모은 $z=(z_1,z_2)^\top$는 변수끼리 아무 관련이 없고 각각 분산이 1이므로 공분산행렬이 단위행렬이다 : $\text{Cov}(z)=I$. 컴퓨터가 바로 만들어 낼 수 있는 가장 기본적인 정규 난수이다.

</details>

<details>

<summary><strong>① 가우시안에서 표본 뽑기 : 무관한 난수로 "상관 있는 데이터"를 만든다</strong></summary>

> <strong>풀려는 문제</strong> : 공분산이 $\Sigma=\begin{bmatrix}4&2\\2&3\end{bmatrix}$인 두 변수 $(x_1,x_2)$를 무작위로 만들고 싶다. 그런데 컴퓨터가 바로 줄 수 있는 것은 서로 무관한 $z_1,z_2$뿐이다. <strong>무관한 난수를 "원하는 공분산을 가진 값"으로 바꾸는 변환</strong>이 필요하고, 그 변환이 $L$이다.

<strong>Step 1. 분해</strong> : $\Sigma=LL^\top$, $L=\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix}$ (아래 예시 ②)

<strong>Step 2. 난수 뽑기</strong> : $z_1,z_2\sim\mathcal N(0,1)$이 우연히 $z=(1,-1)^\top$으로 나왔다고 하자.

<strong>Step 3. 변환</strong> : 평균을 $\mu=0$으로 두면 $x=Lz$이다.

$$
Lz=\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix}\begin{bmatrix}1\\-1\end{bmatrix}=\begin{bmatrix}2\\1-\sqrt2\end{bmatrix}
$$

이렇게 단순한 난수 두 개가 두 변수의 값으로 바뀐다. 이 과정을 계속 반복하면 공분산이 $\Sigma$인 데이터가 쌓인다.

<details>

<summary>왜 상관이 생기는가 : $L$의 열로 읽기</summary>

> 3장에서 본 대로 행렬의 열은 "표준기저가 이동한 곳"이다. $L$의 열은 $(2,1)^\top$과 $(0,\sqrt2)^\top$이므로
$Lz=z_1\begin{bmatrix}2\\1\end{bmatrix}+z_2\begin{bmatrix}0\\\sqrt2\end{bmatrix}=\begin{bmatrix}2z_1\\z_1+\sqrt2\,z_2\end{bmatrix}$

> • $z_1$은 $x_1$과 $x_2$ <strong>양쪽에 동시에</strong> 들어간다 → $z_1$이 크면 둘이 같이 커진다 → <strong>양의 공분산</strong>이 생긴다.
• $z_2$는 $x_2$에만 들어간다 → $x_2$에만 있는 나머지 흔들림을 만든다.

</details>

<details>

<summary>왜 공분산이 정확히 $\Sigma$가 되는가</summary>

> $\text{Cov}(Lz)=L\,\text{Cov}(z)\,L^\top=L\,I\,L^\top=LL^\top=\Sigma$
둘째 등호가 성립하는 이유는 $\text{Cov}(z)=I$이기 때문이다. $z_1,z_2$가 서로 독립이고 각각 분산이 1이므로 대각은 1, 비대각은 0이다.

> 숫자로 확인 : $\text{Var}(x_1)=2^2\cdot1=4$, $\text{Cov}(x_1,x_2)=2\cdot1\cdot1=2$, $\text{Var}(x_2)=1^2+(\sqrt2)^2=3$ → $\Sigma$의 성분과 모두 일치한다.

</details>

<div class="callout" role="note" data-kind="intuition">

<strong>원인 → 결과 사슬</strong> : $\Sigma$를 쪼개 $L$을 얻는다 → 무관한 난수 $z$를 뽑는다 → $L$로 섞는다 → 원하는 공분산을 가진 표본이 나온다. Cholesky는 이 사슬의 첫 고리($\Sigma\to L$)를 맡는다.

</div>

</details>

<details>

<summary><strong>② Reparametrization trick : 난수가 낀 계산을 미분 가능하게 만든다</strong></summary>

> <strong>미분이 왜 필요한가.</strong> 신경망은 (1) 현재 매개변수로 결과를 계산하고, (2) 정답과의 차이(손실)를 재고, (3) <strong>손실을 매개변수로 미분해서</strong> 매개변수를 어느 쪽으로 얼마나 바꿀지 정한다.

> <strong>문제.</strong> 계산 도중에 "평균 $\mu$, 공분산 $\Sigma$인 가우시안에서 표본 $x$를 뽑아라"가 끼어 있으면, $\mu,\Sigma$를 바꿨을 때 $x$가 어떻게 변하는지 적힌 식이 없다. 손실에서 $\mu$로 거슬러 올라가는 길이 "무작위로 뽑기"에서 끊긴다.

> <strong>해결.</strong> 무작위성을 $z$로 따로 빼고, 학습할 값 $\mu,L$은 평범한 식에 둔다.

$$
\boxed{x=\mu+Lz}
$$

$z$는 바깥에서 들어오는 입력값처럼 취급하고, $\mu,L$만 학습한다.

<details>

<summary>숫자 예시 (1차원)</summary>

> $x=\mu+\sigma z$에서 지금 $\mu=1,\ \sigma=2$이고 뽑힌 난수가 $z=0.5$라 하자. (1차원에서는 $L=\sigma$)
$x=1+2\cdot0.5=2$

> $z$가 정해진 순간 $x$는 $\mu,\sigma$에 대한 평범한 식이다. 그래서 $\dfrac{\partial x}{\partial\mu}=1$, $\dfrac{\partial x}{\partial\sigma}=z=0.5$로 미분이 된다.

> 손실이 $f=x^2$이면 $\dfrac{\partial f}{\partial\mu}=2x\cdot1=4$, $\dfrac{\partial f}{\partial\sigma}=2x\cdot z=2$이고, 이 값으로 $\mu,\sigma$를 갱신할 수 있다.

> 실제 학습에서는 $z$가 벡터이고 $L$이 행렬이지만 원리는 같다.

</details>

<details>

<summary>VAE와의 관계</summary>

> VAE(Variational Autoencoder)는 데이터를 압축했다가 다시 생성하도록 학습하는 신경망이다. 압축하는 단계에서 확률분포로부터 표본을 뽑는 과정이 있어서, 그 과정을 위의 꼴로 바꿔 미분이 통과하게 한다.

\[보완\] 공분산이 대각행렬이면 $L=\text{diag}(\sigma_1,\dots,\sigma_n)$이라서 분해를 따로 할 필요 없이 $x=\mu+\sigma\odot z$(성분별 곱)로 쓰면 된다. 일반(전체) 공분산 행렬, 즉 변수들 사이에 상관이 있는 경우에 Cholesky로 $L$을 구한다.

</details>

</details>

<details>

<summary><strong>③ det를 싸게 계산 : 삼각행렬의 대각곱</strong></summary>

> 이 항목은 확률을 몰라도 이해할 수 있다. 위 예시의 $L$을 다시 보자.

$$
L=\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix}
$$

> 4.1에서 본 대로 삼각행렬의 det는 대각 성분의 곱이다 : $\det(L)=2\sqrt2$.
$A=LL^\top$이므로 $\det(A)=\det(L)\det(L^\top)=\det(L)^2=(2\sqrt2)^2=8$.

> 원래 행렬 $A=\begin{bmatrix}4&2\\2&3\end{bmatrix}$로 직접 계산해도 $\det(A)=4\cdot3-2\cdot2=8$로 같다. ✓

<details>

<summary>$n\times n$이 커지면 : 일반식과 로그</summary>

> $100\times100$처럼 커져도 Cholesky 인수 $L$이 이미 있으면 대각 성분 100개를 곱하면 끝이다.

$$
\det(A)=\prod_i l_{ii}^2,\qquad \log\det(A)=2\sum_i\log l_{ii}
$$

> <strong>왜 </strong>$\log\det$<strong>이 자주 필요한가.</strong> 다변량 가우시안의 확률밀도 식에 $\det\Sigma$가 들어 있어서(6장), 로그 우도를 계산하면 $\log\det\Sigma$가 나온다. 또 $l_{ii}$ 수백 개를 그대로 곱하면 값이 너무 커지거나 너무 작아지기 쉽지만, 로그를 취하면 곱이 합으로 바뀌어 수치적으로 안정적이다.

</details>

</details>

<div class="callout" role="note" data-kind="intuition">

<strong>세 줄을 한 장으로</strong> : Cholesky는 단순히 행렬을 둘로 쪼개는 기술이 아니라, <strong>공분산을 가진 데이터를 만들거나 det 같은 계산을 싸게 하도록 도와주는 도구</strong>이다. 한 번 구한 $L$을 표본 뽑기, 미분, det 계산에 계속 재사용하는 것이 요점이다.

</div>

| 개념 | 쉽게 말하면 | $L$이 하는 일 |
| --- | --- | --- |
| 가우시안 표본 뽑기 | 원하는 공분산을 따르는 데이터 만들기 | 무관한 난수 $z$를 공분산 구조로 변환 ($x=\mu+Lz$) |
| Reparametrization trick | 난수가 낀 계산을 미분 가능하게 쓰기 | 학습할 값 $\mu,L$과 난수 $z$를 분리 |
| det 계산 | 큰 행렬의 det를 싸게 구하기 | 대각 성분만 곱해서 계산 ($\det(A)=\prod_i l_{ii}^2$) |

※ VAE와 reparametrization trick은 지금 완전히 이해하지 못해도 된다. 가우시안, 분산, 공분산의 뜻을 먼저 익히고(6장) 다시 보면 자연스럽게 이어진다.

</details>

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
