---
title: "Eigenvalue & Eigenvector"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/eigen-theory
status: seed
order: 1
---

> 정사각행렬 $A\in\mathbb{R}^{n\times n}$에 대해 $Ax=\lambda x$를 만족하는 영벡터가 아닌 $x$를 <strong>eigenvector(고유벡터)</strong>, 그때의 $\lambda$를 <strong>eigenvalue(고유값)</strong> 라 한다.
$Ax=\lambda x$를 eigenvalue equation이라 부른다.
※ eigen은 독일어로 “고유한, 자기 자신의”라는 뜻이다.

<details>

<summary><strong>배경지식 (0에서 시작)</strong></summary>

<details>

<summary>① 대부분의 벡터는 A를 곱하면 방향이 틀어진다</summary>

> 행렬 $A$는 $x$를 $Ax$로 보내는 선형사상이다. 일반적인 $x$는 $Ax$가 되면서 방향이 틀어진다. (회전·전단이 섞인다.)
그런데 $Ax$<strong>가 </strong>$x$<strong>와 같은 직선 위에 놓이는 특별한 벡터</strong>가 있을 수 있다. 이런 벡터를 찾는 문제가 고유값 문제이다.

</details>

<details>

<summary>② codirected / collinear (교재 Definition 4.7)</summary>

> 같은 방향이면 codirected, 같은 방향 또는 정반대 방향이면 collinear.
$Ax=\lambda x$는 “$Ax$와 $x$가 collinear”라는 뜻이다. ($\lambda<0$이면 정반대 방향)

> \[보완\] codirected와 collinear는 같은 말이 아니다. codirected는 <strong>같은 방향</strong>(양의 배수만), collinear는 <strong>같은 직선 위</strong>(양의 배수 또는 음의 배수)이다. 따라서 codirected이면 collinear이지만 그 역은 성립하지 않는다. $Ax=\lambda x$에서 $\lambda>0$이면 codirected, $\lambda<0$이면 collinear이면서 정반대 방향이다. 고유값의 부호가 어떻든 성립해야 하므로 정의에는 collinear가 쓰인다.

</details>

<details>

<summary>③ 왜 영벡터는 제외하는가</summary>

> $A\mathbf{0}=\lambda\mathbf{0}$은 <strong>모든</strong> $\lambda$에 대해 성립하므로 아무 정보가 없다. 그래서 $x\neq0$을 요구한다.

</details>

<details>

<summary>④ 기저변환 · 닮음 (2.7.2 복습)</summary>

> 같은 선형사상을 다른 기저에서 본 행렬은 $S^{-1}AS$이다. 이 노트는 “어떤 기저에서 보면 A가 가장 단순해지는가”라는 질문으로 이어진다. (4.4 대각화)

> \[보완\] 이 노트의 결론은, 고유값·고유벡터를 이용해서 복잡한 행렬 $A$를 계산하기 쉬운 대각행렬 $D=S^{-1}AS$로 표현할 수 있다는 것이다.

</details>

</details>

<details>

<summary><strong>왜 필요한가</strong></summary>

> <strong>A는 공간을 한꺼번에 복잡하게 비튼다.</strong> 이 변환을 이해하려면 “A가 단순한 늘임으로만 작동하는 방향”을 찾는 것이 가장 쉽다. 그 방향이 eigenvector이고, 늘어나는 배율이 eigenvalue이다.

\[보완\] 선형독립인 $n$개의 고유벡터를 새로운 기저로 삼으면, 각 기저 방향에 대응하는 고유값만큼 스칼라배하는 대각행렬이 원래 $A$와 동일한 선형변환 효과를 낸다.

<strong>원인 → 결과 사슬</strong>

1. 고유벡터들로 기저를 잡는다.
1. 그 기저의 좌표에서 A는 각 축을 $\lambda_i$배 하는 변환일 뿐이다. 즉 <strong>대각행렬</strong>이 된다.
1. 대각행렬이면 거듭제곡 $A^k$, 역행렬, det를 한 줄로 계산할 수 있다.

<details>

<summary>예시 : $A^kx$를 한 줄로 구하기</summary>

> $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$의 고유쌍은 $\lambda_1=3,\;v_1=\begin{bmatrix}1\\1\end{bmatrix}$, $\lambda_2=1,\;v_2=\begin{bmatrix}1\\-1\end{bmatrix}$이다.
검산 : $Av_1=(3,3)=3v_1$, $Av_2=(1,-1)=1\cdot v_2$.

> $x=\begin{bmatrix}2\\0\end{bmatrix}$을 고유벡터 기저로 표현하면 $x=1\cdot v_1+1\cdot v_2$이다. (좌표 $(1,1)$)
A를 한 번 곱하면 각 좌표에 고유값이 곱해진다 : $Ax=3v_1+1\cdot v_2=(4,2)$. (직접 계산 $A(2,0)^\top=(4,2)$ ✓)

> $k$번 곱하면 $A^kx=3^kv_1+1^kv_2=\begin{bmatrix}3^k+1\\3^k-1\end{bmatrix}$.
$k=2$이면 $(10,8)$이고, 직접 $A^2=\begin{bmatrix}5&4\\4&5\end{bmatrix}$로 계산해도 $A^2x=(10,8)$로 같다.

<div class="callout" role="note" data-kind="intuition">

행렬곱을 $k$번 하는 대신, ① $x$를 고유벡터 좌표로 바꾸고 ② 각 좌표에 $\lambda_i^k$를 곱하고 ③ 되돌린다. 기저변환으로 계산이 쉬워진 것이다.

</div>

<details>

<summary>\[보완\] 좌표가 1:1이 아닌 예 : $x=3v_1+2v_2$ (왜 좌표에 고유값이 곱해지는가)</summary>

$x=3v_1+2v_2=(3,3)+(2,-2)=(5,1)$이다. 고유벡터 좌표는 $(3,2)$이다.

<strong>근거</strong> : $A$는 선형이고 $Av_1=3v_1$, $Av_2=1\cdot v_2$이므로 $Ax=3\,Av_1+2\,Av_2=3\cdot3\,v_1+2\cdot1\,v_2=9v_1+2v_2$이다. 각 좌표가 그 방향의 고유값만큼 곱해진 것이다.

$9v_1+2v_2=(9,9)+(2,-2)=(11,7)$. 직접 계산 $A(5,1)^\top=(2\cdot5+1,\;5+2\cdot1)=(11,7)$ ✓

$k$번 곱하면 $A^kx=3\cdot3^kv_1+2\cdot1^kv_2=(3^{k+1}+2,\;3^{k+1}-2)$. $k=2$이면 $(29,25)$이고 $A^2=\begin{bmatrix}5&4\\4&5\end{bmatrix}$로 직접 곱해도 $(29,25)$이다.

</details>

</details>

</details>

<details>

<summary><strong>직관</strong></summary>

<details>

<summary>고유값 $\lambda$의 크기와 부호가 말해주는 것</summary>

| $\lambda$ | 그 고유벡터 방향에서 A가 하는 일 |
| --- | --- |
| $\lambda>1$ | 늘인다 |
| $0<\lambda<1$ | 줄인다 |
| $\lambda=1$ | 그대로 둔다 |
| $\lambda<0$ | 방향을 뒤집고 $\|\lambda\|$배 한다 |
| $\lambda=0$ | 그 방향이 통째로 0으로 사라진다 (kernel) |

</details>

<div class="callout" role="note" data-kind="intuition">

$\lambda=0$<strong>이 고유값이다 </strong>$\iff$<strong> 영벡터 아닌 </strong>$x$<strong>가 </strong>$Ax=0$<strong> </strong>$\iff \ker(A)\neq\{0\}$<strong> </strong>$\iff \det(A)=0$
4.1의 “납작해짐” 사슬과 정확히 같은 사건이다.

</div>

<details>

<summary>고유벡터는 벡터 하나가 아니라 “방향”이다</summary>

> $x$가 고유벡터이면 0이 아닌 모든 $c$에 대해 $cx$도 같은 고유값의 고유벡터이다.
$A(cx)=cAx=c\lambda x=\lambda(cx)$
따라서 하나의 고유값에는 직선(또는 평면 이상의 부분공간) 전체가 대응한다. 이것이 eigenspace이다.

</details>

</details>

<details>

<summary><strong>동치 조건과 Eigenspace</strong></summary>

> 다음은 모두 같은 말이다. ($A\in\mathbb{R}^{n\times n}$)
• $\lambda$는 $A$의 eigenvalue이다.
• $Ax=\lambda x$를 만족하는 $x\neq0$이 존재한다.
• $(A-\lambda I)x=0$이 비자명한 해를 가진다.
• $\text{rank}(A-\lambda I)<n$
• $\det(A-\lambda I)=0$

> <strong>Eigenspace</strong> $E_\lambda=\ker(A-\lambda I)$ : $\lambda$에 대응하는 모든 고유벡터(와 영벡터)가 이루는 부분공간.
<strong>Eigenspectrum(spectrum)</strong> : $A$의 모든 고유값의 집합.

※ 영벡터는 $E_\lambda$에 포함되지만 “고유벡터”라고 부르지는 않는다.

</details>

<details>

<summary><strong>예시</strong></summary>

<details>

<summary>① 항등행렬 (교재 Example 4.4)</summary>

> $Ix=1\cdot x$이므로 고유값은 $1$ 하나이고, 영벡터가 아닌 <strong>모든 벡터</strong>가 고유벡터이다. $E_1=\mathbb{R}^n$.

</details>

<details>

<summary>② 위의 $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$</summary>

> $E_3=\text{span}\{(1,1)^\top\}$, $E_1=\text{span}\{(1,-1)^\top\}$. 이 두 방향이 2장 Example 2.23의 기저변환에서 A를 $\text{diag}(3,1)$로 만든 기저이다.

</details>

</details>

<details>

<summary><strong>Characteristic Polynomial (특성다항식) : 고유값을 찾는 방법</strong></summary>

> $p_A(\lambda):=\det(A-\lambda I)$ : 정사각행렬 $A$에서 만든 $\lambda$<strong>에 대한 </strong>$n$<strong>차 다항식</strong>.
전개하면 $p_A(\lambda)=c_0+c_1\lambda+\cdots+c_{n-1}\lambda^{n-1}+(-1)^n\lambda^n$이고, 특히 $c_0=\det(A),\;\;c_{n-1}=(-1)^{n-1}\text{tr}(A)$.

<details>

<summary><strong>배경지식 (0에서 시작)</strong></summary>

<details>

<summary>① 다항식의 근(root)</summary>

> $p(\lambda)=0$을 만족하는 $\lambda$. $n$차 다항식은 복소수까지 허용하면 중복을 포함해 $n$개의 근을 갖지만, <strong>실수 근은 없을 수도 있다.</strong>

</details>

<details>

<summary>② 왜 $A-\lambda$가 아니라 $A-\lambda I$인가</summary>

> $\lambda$는 숫자(스칼라)이고 $A$는 행렬이라 직접 뺄 수 없다. $\lambda I$로 바꾸면 <strong>대각 성분에서만 </strong>$\lambda$<strong>를 빼는</strong> 행렬이 된다.

</details>

<details>

<summary>③ $\det=0$의 의미 (Determinant 노트 복습)</summary>

> $Mx=0$이 <strong>영벡터가 아닌 해를 가진다</strong> $\iff \ker(M)\neq\{0\}\iff M$이 invertible이 아니다 $\iff\det(M)=0$.

</details>

</details>

<details>

<summary><strong>왜 필요한가</strong></summary>

> 4.2의 질문 : <strong>"A를 곱해도 방향이 안 변하고 길이만 </strong>$\lambda$<strong>배가 되는 영벡터 아닌 </strong>$x$<strong>가 있는가?"</strong> 즉 $Ax=\lambda x$.
문제는 $\lambda$도 $x$도 모른다는 점이다. 그래서 $x$를 소거하고 $\lambda$만의 방정식을 만들어야 한다.

<details>

<summary>$x$를 소거하는 과정</summary>

> 1. $Ax=\lambda x\iff(A-\lambda I)x=0$  ($\lambda x=\lambda Ix$이므로)
2. $x\neq0$인 해가 존재하려면 $A-\lambda I$가 <strong>invertible이 아니어야</strong> 한다.
3. 이는 곧 $\det(A-\lambda I)=0$이다.
→ $x$는 사라지고 $\lambda$<strong>에 대한 방정식 </strong>$p_A(\lambda)=0$ 만 남는다.

</details>

> <strong>Theorem 4.8</strong> $\lambda$가 $A$의 고유값 $\iff\lambda$가 $p_A$의 근

<div class="callout" role="note" data-kind="intuition">

<strong>4.1에서 배운 "det=0 ⟺ 비자명한 kernel"이 바로 고유값을 찾는 방법이 된다.</strong>

</div>

</details>

<details>

<summary><strong>직관</strong></summary>

> 숫자 $\lambda$를 연속적으로 움직이면서 $A-\lambda I$의 부피 배율 $\det(A-\lambda I)$를 지켜본다고 하자.
대부분의 $\lambda$에서는 0이 아니다. (부피가 살아 있다.)
그런데 몇몇 <strong>특별한 </strong>$\lambda$<strong>에서만</strong> 부피가 0으로 납작해진다. 이때 어떤 방향이 통째로 사라진다. 그 방향이 고유벡터이고, 그 특별한 $\lambda$가 고유값이다.

</details>

<details>

<summary><strong>계수의 의미 : det와 trace가 한 식에 등장한다</strong></summary>

<details>

<summary>$c_0=\det(A)$</summary>

> $\lambda=0$을 대입하면 $p_A(0)=\det(A-0\cdot I)=\det(A)$. 상수항이 곧 $c_0$이다.

</details>

<details>

<summary>$c_{n-1}=(-1)^{n-1}\text{tr}(A)$</summary>

> ※ 교재 밖 보충(핵심 아이디어). $\det(A-\lambda I)$를 전개했을 때 $\lambda^{n-1}$이 나올 수 있는 항은 대각 성분의 곱 $\prod_i(a_{ii}-\lambda)$ 뿐이다. 이 곱에서 $\lambda^{n-1}$의 계수는 $(-1)^{n-1}\sum_i a_{ii}$이다.

</details>

<details>

<summary>근과 계수의 관계로 읽기 (4.2에서 다시 만남)</summary>

> ※ 교재 밖 보충. 근을 $\lambda_1,\dots,\lambda_n$(복소수 포함)이라 하면, 위의 $c_0$와 $c_{n-1}$로부터
$\sum_i\lambda_i=\text{tr}(A),\;\;\prod_i\lambda_i=\det(A)$
즉 <strong>고유값의 합은 trace, 곱은 det</strong>이다.

</details>

</details>

<details>

<summary><strong>예시</strong></summary>

<details>

<summary>① $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$</summary>

> $p_A(\lambda)=\det\begin{bmatrix}2-\lambda&1\\1&2-\lambda\end{bmatrix}=(2-\lambda)^2-1=\lambda^2-4\lambda+3=(\lambda-1)(\lambda-3)$
- 상수항 $3=\det(A)$ ✓
- $\lambda$의 계수 $-4=(-1)^{1}\text{tr}(A)=-4$ ✓
- 근은 $\lambda=1,\,3$이고, 합 $=4=\text{tr}(A)$, 곱 $=3=\det(A)$ ✓

<div class="callout" role="note" data-kind="intuition">

이 근 $3,1$은 2장 Example 2.23에서 기저 $B=\big((1,1)^\top,(1,-1)^\top\big)$로 바꿈을 때 나온 대각 성분 $3,1$과 같다. 왜 같은지는 4.2·4.4에서 풀린다.

</div>

</details>

<details>

<summary>② 항등행렬</summary>

> $p_I(\lambda)=\det(I-\lambda I)=(1-\lambda)^n$ : 고유값은 $\lambda=1$ 하나뿐이고 $n$번 겹친다. (교재 Example 4.4)
$Ix=1\cdot x$이므로 영벡터가 아닌 <strong>모든 벡터</strong>가 고유벡터이다.

</details>

<details>

<summary>③ 실수 근이 없는 경우 : 90° 회전</summary>

> $R=\begin{bmatrix}0&-1\\1&0\end{bmatrix}$이면 $p_R(\lambda)=\det\begin{bmatrix}-\lambda&-1\\1&-\lambda\end{bmatrix}=\lambda^2+1$이고 실수 근이 없다.
직관과 일치한다. 평면에서 90° 회전하면 <strong>모든 벡터의 방향이 바뀌므로</strong> 방향이 유지되는 벡터가 없다. (교재의 고유값 정의는 $\lambda\in\mathbb{R}$이다.)

</details>

</details>

<details>

<summary><strong>이걸 모르면?</strong></summary>

- 고유값 · 고유벡터 계산 (4.2)
- 대각화 (4.4)
- SVD (4.5)
- 이해 어려움

</details>

<div class="callout" role="note" data-kind="stuck">

<strong>막힐 가능성이 높은 지점</strong>

1. $A-\lambda I$<strong>에서 </strong>$I$<strong>를 빼먹고 </strong>$A-\lambda$<strong>로 쓰는 실수.</strong>
1. <strong>부호 규약.</strong> 교재의 최고차항은 $(-1)^n\lambda^n$이라 monic이 아니다. 다른 책의 $\det(\lambda I-A)$는 monic이지만 근은 같다. 교재의 $c_{n-1}$의 부호 $(-1)^{n-1}$도 이 규약 때문에 생긴다.
1. <strong>근이 실수가 아닐 수 있다.</strong> (회전 예시)
1. $p_A(\lambda)=0$<strong>을 푸는 것은 고유값을 구한 것이지 고유벡터를 구한 것이 아니다.</strong> 고유벡터는 각 $\lambda$마다 $(A-\lambda I)x=0$을 따로 풀어야 한다.

</div>

</details>

<details>

<summary><strong>성질</strong></summary>

<details>

<summary>$A$와 $A^\top$은 같은 고유값을 갖는다 (고유벡터는 다를 수 있다)</summary>

> $\det(A-\lambda I)=\det\big((A-\lambda I)^\top\big)=\det(A^\top-\lambda I)$. 4.1의 “$\det(A)=\det(A^\top)$”만으로 특성다항식이 같다.

</details>

<details>

<summary>닮은 행렬은 같은 고유값을 갖는다</summary>

> $\det(S^{-1}AS-\lambda I)=\det\big(S^{-1}(A-\lambda I)S\big)=\det(A-\lambda I)$ (4.1의 닮음 성질)
따라서 고유값은 det, trace처럼 <strong>기저에 무관한 값</strong>이다. 선형사상 $\Phi$ 자체가 가진 고유값이라 말할 수 있다.

</details>

<details>

<summary>대칭 양의 정부호(SPD) 행렬의 고유값은 모두 양의 실수이다</summary>

> 3장 Symmetric Positive Definite 노트의 행렬이 여기서 다시 나온다. 
<strong>증명 (한 줄)</strong> : $Ax=\lambda x$, $x\neq0$이면 $x^\top Ax=\lambda\,x^\top x$이다. 양의 정부호이므로 좌변이 $>0$이고 $x^\top x>0$이므로 $\lambda=\dfrac{x^\top Ax}{x^\top x}>0$이다. (대칭이라서 고유값이 실수라는 사실은 Spectral Theorem에서 온다.)

</details>

</details>

<details>

<summary><strong>이걸 모르면?</strong></summary>

- 대각화 (4.4)
- SVD (4.5)
- PCA (10장)
- 거듭제곡이 수렴하는지 판단 ($A^kx$의 장기 거동)
- 이해 어려움

</details>
