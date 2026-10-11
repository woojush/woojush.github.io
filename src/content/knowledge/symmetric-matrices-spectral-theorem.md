---
title: "대칭행렬과 Spectral Theorem"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/eigen-theory
status: seed
order: 4
---

> 대칭행렬은 일반 행렬보다 더 좋은 조건으로 대각화할 수 있다.
>
> 일반 행렬 A가 대각화 가능하다면, $A=PDP^{−1}$로 표현할 수 있다. 
\*$D$는 고유값으로 이루어진 대각행렬이며, $P^{-1}$는 고유벡터를 열벡터로 하는 행렬이다.
>
> 이때, 대각화를 쉽게 풀기 위해서는 $P^{-1} =P^{\top}$ 즉, $P^{\top}P=I$를 만족해야한다.
다시 말해 $P$를 구성하는 고유벡터들이 각각 서로 직교이면서, norm이 1이어야 한다는 것.
>
> 그런데 <strong>모든 행렬에서 고유벡터들을 정규직교하게 구성할 수 있는 것은 아니다.
</strong>그렇다면 어떤 조건에서 이러한 정규직교 고유벡터 기저를 보장할 수 있을까?
>
> 바로 실수 대칭행렬 $A=A^\top$일 때이다.
Spectral Theorem은 모든 실수 대칭행렬이 정규직교 고유벡터 기저를 가지며, 모든 고윳값이 실수임을 보장한다.
>
> 따라서 대칭행렬은 항상 $A=PDP^{\top}$로 대각화할 수 있다.
>
> <details>
>
> <summary>$A\in\mathbb{R}^{n\times n}$<strong>이 대칭이면 서로 다른 고유값의 고유벡터는 직교한다.</strong></summary>
>
> >
> >
> > 그 이유 : $Ax=\lambda x$, $Ay=\mu y$, $A=A^\top$이면
$\lambda\,x^\top y=(Ax)^\top y=x^\top A^\top y=x^\top Ay=\mu\,x^\top y$
$\Rightarrow(\lambda-\mu)\,x^\top y=0$이고 $\lambda\neq\mu$이므로 $x^\top y=0$.
>
> </details>
>
> <details>
>
> <summary>$A\in\mathbb{R}^{n\times n}$<strong>이 대칭이면 모든 고유값은 실수이다.</strong></summary>
>
> > 복소벡터 $x$에 대해 $Ax=\lambda x$이면 $x^*Ax=\lambda\,x^*x$이다. $A$가 실대칭이면 $(x^*Ax)^*=x^*A^*x=x^*Ax$이므로 $x^*Ax$는 실수이고, $x^*x=\Vert x\Vert^2>0$도 실수이다. 따라서 $\lambda=\dfrac{x^*Ax}{x^*x}$는 실수이다
>
> </details>
>
> <details>
>
> <summary>$A=PDP^\top$의 의미</summary>
>
> > $P=[p_1\cdots p_n]$ : 정규직교 고유벡터를 열로 가진 orthogonal 행렬, $D=\text{diag}(\lambda_1,\dots,\lambda_n)$.
$x\to P^\top x$는 $x$를 고유벡터 좌표로 바꾸고(내적만 하면 된다), $D$가 각 좌표를 $\lambda_i$배 하고, $P$가 되돌린다. 앞에서 본 “기저변환 → 늘임 → 되돌림”이 역행렬 계산 없이 이루어진다.
>
> </details>

<details>

<summary><strong>왜 필요한가</strong></summary>

> 일반 행렬은 고유벡터가 서로 비스듬하고, 심지어 개수가 모자라 대각화가 안 될 수도 있다(defective, 4.2). 그런데 <strong>대칭행렬은 항상 가장 깔끔한 경우</strong>이다.

- 고유값이 전부 실수이다.
- 고유벡터로 <strong>서로 직교하는</strong> 기저를 잡을 수 있다.
- 따라서 $P$가 orthogonal이 되어 $A=PDP^{-1}$이 $A=PDP^\top$로 단순해진다.

> 그리고 ML에서 자주 다루는 행렬(공분산, Gram, $A^\top A$)이 거의 대칭이다. 그래서 Theorem 4.14가 “어떤 행렬이든 대칭행렬로 만드는 방법”으로 쓰인다. \[보완\] 교재 Theorem 4.14의 정확한 내용 : 임의의 $A\in\mathbb R^{m\times n}$에 대해 $A^\top A$는 항상 대칭 <strong>양의 준정부호(PSD)</strong> 이고, rank\$(A)=n\$이면 <strong>양의 정부호(PD)</strong> 이다. 즉 “$A^\top A$는 언제나 Spectral Theorem의 대상이 된다”는 뜻이며, SVD(4.5)가 이 사실 위에 선다.

</details>

<details>

<summary><strong>예시 : 교재 Example 4.8 (중복 고유값이 있는 대칭행렬)</strong></summary>

> $A=\begin{bmatrix}3&2&2\\2&3&2\\2&2&3\end{bmatrix}$, $p_A(\lambda)=-(\lambda-1)^2(\lambda-7)$ $\Rightarrow$ $\lambda_1=1$ (중복), $\lambda_2=7$.
검산 : 합 $1+1+7=9=\text{tr}(A)$, 곱 $1\cdot1\cdot7=7=\det(A)$ ✓

<details>

<summary>Eigenspace</summary>

> $E_1=\text{span}\Big\{x_1=\begin{bmatrix}-1\\1\\0\end{bmatrix},\;x_2=\begin{bmatrix}-1\\0\\1\end{bmatrix}\Big\}$, $E_7=\text{span}\Big\{x_3=\begin{bmatrix}1\\1\\1\end{bmatrix}\Big\}$
• $x_3\perp x_1,\;x_3\perp x_2$ ✓ (서로 다른 고유값이라 자동으로 직교)
• 그러나 $x_1^\top x_2=1\neq0$ : <strong>같은 고유값의 두 고유벡터는 직교하지 않는다.</strong>

</details>

<details>

<summary>해결 : $E_1$ 안에서 Gram–Schmidt</summary>

> $x_1,x_2$는 같은 고유값의 고유벡터이므로 <strong>그 선형결합도 같은 고유값의 고유벡터</strong>이다 : $A(\alpha x_1+\beta x_2)=\lambda(\alpha x_1+\beta x_2)$.
따라서 Gram–Schmidt로 $x_2$에서 $x_1$ 방향 성분을 빼도 여전히 고유벡터이다.
$x_1'=x_1=(-1,1,0)^\top$
$x_2'=x_2-\dfrac{x_2^\top x_1}{x_1^\top x_1}x_1=(-1,0,1)^\top-\tfrac12(-1,1,0)^\top=\big(-\tfrac12,-\tfrac12,1\big)^\top$
검산 : $x_1'^\top x_2'=\tfrac12-\tfrac12+0=0$ ✓, 그리고 $x_3$와도 여전히 직교.

</details>

</details>

<details>

<summary><strong>AI Engineering Relevance</strong></summary>

<div class="callout" role="note" data-kind="intuition">

<strong>왜 AI 엔지니어가 이 개념을 알아야 하는가?</strong>
• <strong>Spectral methods</strong> : Further Reading에 따르면 고유값 분해는 PCA, Fisher discriminant analysis, MDS, Isomap, Laplacian eigenmaps, spectral clustering 같은 방법의 바탕이다. 모두 대칭 positive (semi)definite 행렬의 고유분해에 의존한다.
• <strong>PCA (10장)</strong> : 데이터의 공분산 행렬은 대칭 PSD이므로 Spectral Theorem이 직교하는 주성분 방향의 존재를 보장한다.
• <strong>PageRank (교재 Example 4.9)</strong> : 웹 페이지의 중요도 벡터 $x^*$는 전이행렬 $A$의 <strong>고유값 1에 대응하는 고유벡터</strong>($Ax^*=x^*$)이다. 앞의 $A^kx$ 예시처럼 $x,Ax,A^2x,\dots$를 계속 곱하면 $|\lambda|<1$인 성분은 $\lambda^k\to0$으로 사라지고 $\lambda=1$ 성분만 남아 $x^*$로 수렴한다.
• <strong>네트워크 분석 (교재 Example 4.7)</strong> : 연결 행렬이 비대칭이면 고유값이 실수가 아닐 수 있어, $A+A^\top$로 대칭화한 뒤 고유값(eigenspectrum)을 본다.

</div>

</details>

<details>

<summary><strong>이걸 모르면?</strong></summary>

- Cholesky (4.3), 대각화 (4.4), SVD (4.5)
- PCA (10장), 다변량 Gaussian 공분산 (6장)
- 이해 어려움

</details>

<div class="callout" role="note" data-kind="note">

<strong>\[보완\] 풀린 것 / 남은 것 (Spectral Theorem → 다음 노트)</strong>

<strong>풀린 것</strong> : 대칭행렬은 고유값이 실수이고 정규직교 고유기저가 있어서 $A=PDP^\top$로 쓸 수 있다. 역행렬 계산 없이 “기저변환 → 늘임 → 되돌림”이 된다.

<strong>남은 것 1 (다음 노트 Cholesky)</strong> : 공분산처럼 대칭이면서 양의 정부호인(SPD) 행렬로 가우시안 표본 추출이나 det 계산을 할 때, 고유벡터까지 구하지 않고도 쓸 수 있는 더 싼 분해는 없는가?

<strong>남은 것 2 (그다음 노트들)</strong> : 대칭이 아닌 일반 정사각행렬은 어디까지 $PDP^{-1}$로 쓸 수 있는가? 정사각도 아닌 행렬은?

</div>
