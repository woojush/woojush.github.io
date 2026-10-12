---
title: "Gram-Schmidt Orthogonalization"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/orthogonality-projection
status: seed
order: 4
---

<details>

<summary>

<strong>왜 필요한가?</strong>

</summary>

> 일반 basis에서는 $B(B^\top B)^{-1}B^\top$와 같이 basis 사이의 관계를 반영하는 연산이 필요하다.
>
> 반면 orthogonal basis를 사용하면 $B^\top B = \operatorname{diag}(\Vert{}u_1\Vert{}^2, \dots, \Vert{}u_m\Vert{}^2)$가 되어 projection 계산 구조가 단순해진다.
>
> 그리고 ONB라면 $B^\top B = I$이므로 $\pi_U(x) = BB^\top x$가 된다.
>
> 즉 핵심은 <strong>“orthogonal structure를 이용하면 projection 계산이 구조적으로 단순해진다"</strong>라는 점이다.

</details>

<details>

<summary>

<strong>핵심 아이디어</strong>

</summary>

> Gram-schmidt의 핵심 알고리즘은 <strong>Orthogonal Projeciton</strong>이다.
기존의 기저벡터 행렬 $B = \begin{bmatrix} \mid & \mid & & \mid \\ b_1 & b_2 & \dots & b_m \\ \mid & \mid & & \mid \end{bmatrix}$을 통해 새로운 직교기저벡터 행렬 $U=\begin{bmatrix} \mid & \mid & & \mid \\ u_1 & u_2 & \dots & u_m \\ \mid & \mid & & \mid \end{bmatrix}$ 를 만드는 방식이다.
>
> <div class="callout" role="note" data-kind="intuition">
>
>
>
> 1. $u_1=b_1$으로 정의
>
> ---
>
> 1. $b_2$와 $b_2$를 $\text{span}(u_1)$에 사영한 벡터의 차를 새로운 기저 $u_2$라 정의.
>    $u_2 = b_2 - \pi_{\text{span}(u_1)}(b_2)$
>
> ---
>
> 1. $u_3 = b_3 - \pi_{\text{span}(u_1,u_2)}(b_3)$
>
> …
>
> </div>
>
> 즉, <strong>현재 벡터에서 이미 만들어진 공간의 성분을 제거하여, 그 공간에 orthogonal한 새로운 방향을 만든다.</strong>
>
> ---
>
> ---

</details>

<details>

<summary>

<strong>성분적 측면의 분해</strong>

</summary>

> $k$번째 basis vector $b_k$를 생각해 봅시다. 앞에서 이미 $u_1,\dots,u_{k-1}$을 만들어 두었다고 하자.
>
> 그리고 이들이 만드는 부분공간을 $U_{k-1} = \operatorname{span}(u_1,\dots,u_{k-1})$라고 하자.

> 새로운 벡터 $b_k$는 일반적으로 다음과 같이 두 성분을 동시에 가지고 있다.
>
> 1. 이미 $U_{k-1}$ 안에 존재하는 방향의 성분
> 1. $U_{k-1}$에 포함되지 않는 기존 공간에 orthogonal한 성분

---

따라서 $b_k$를 다음처럼 분해할 수 있다.

<div class="callout" role="note" data-kind="intuition">



$$
b_k = \underbrace{\pi_{U_{k-1}}(b_k)}_{U_{k-1}\text{이 이미 설명하는 성분}} + \underbrace{\left(b_k-\pi_{U_{k-1}}(b_k)\right)}_{U_{k-1}\text{에 수직인 새로운 성분}}
$$

</div>

> 여기서 우리가 원하는 것은 기존 방향과 겹치지 않는 새로운 방향이다.
따라서 다음과 같이 정의한다.

<div class="callout" role="note" data-kind="intuition">



$$
u_k := b_k-\pi_{U_{k-1}}(b_k)
$$

</div>

> <strong>💡 Gram-Schmidt의 핵심</strong>
>
> 새로운 벡터에서 기존에 만들어진 공간으로의 projection을 제거하여, 기존 공간과 orthogonal한 새로운 방향만 남긴다.

</details>

<details>

<summary>

<strong>Span preservation</strong>

</summary>

> $u_k$는 $b_k$와 이전 $u_i$들의 선형결합이므로 $u_k \in \operatorname{span}(b_1, \dots, b_k)$이다.
( $u_i$의 가장 처음 모습인 $u_1=b_1$이므로)
>
> 반대로 $b_k = u_k + \pi_{U_{k-1}}(b_k)$이고 projection은 이전 $u_i$들의 선형결합이므로 $b_k \in \operatorname{span}(u_1, \dots, u_k)$이다.
>
> 따라서 양쪽 span이 같다 ($\operatorname{span}(b_1, \dots, b_k) = \operatorname{span}(u_1, \dots, u_k)$).

<div class="callout" role="note" data-kind="intuition">

($\operatorname{span}(u_1, \dots, u_k) = \operatorname{span}(b_1, \dots, b_k)$).

</div>

</details>

<details>

<summary>

<strong>Orthonormalization</strong>

</summary>

> 앞서 설명했듯, ONB일 때에 그 수식이 단순해지는 것이므로, orthogonal → orthonormal의 과정이 필요하다.

> orthogonal vector를 orthonormal로 만들기 위해서는 normalization만 거치면 된다.
normalization은 벡터의 방향은 유지하면서 norm을 1로 만드는 작업이다.
따라서 $\R^n$ 공간에서 벡터는 방향과 크기를 갖기 때문에 벡터를 벡터의 크기로 나누면 된다.

> 따라서 orthonormal vector를 열벡터로 갖는 행렬 $Q = \begin{bmatrix} \mid & \mid & & \mid \\ q_1 & q_2 & \dots & q_m \\ \mid & \mid & & \mid \end{bmatrix}$이라 할 때, $q_i=\dfrac{u_i}{||u_i||}$이다.
>
> 이러한 $Q$에 대해, $Q^{\top}Q=I$가 성립한다.

</details>

<details>

<summary>

<strong>예시</strong>

</summary>

> $b_1 = \begin{bmatrix} 2 \\ 0 \end{bmatrix}$, $b_2 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$이 $\mathbb{R}^2$의 basis라고 하자.

<details>

<summary>

<strong>Step 1. 첫 번째 벡터</strong>

</summary>

> 처음에는 비교할 기존 공간이 없으므로 그대로 둔다.
$u_1 = b_1 = \begin{bmatrix} 2 \\ 0 \end{bmatrix}$

</details>

<details>

<summary>

<strong>Step 2. 두 번째 벡터에서 기존 방향 제거</strong>

</summary>

현재 기존 공간은 $U_1=\operatorname{span}(u_1)$이다.
따라서 $b_2$에서 $u_1$ 방향 성분을 제거한다.
$u_2 = b_2-\pi_{U_1}(b_2)$

</details>

> $1$차원 projection 공식을 사용하면 다음과 같다.
>
> $\pi_{U_1}(b_2) = \dfrac{\langle b_2,u_1\rangle}{\Vert{}u_1\Vert{}^2} u_1$ 계산하면 $\langle b_2,u_1\rangle = 2$, $\Vert{}u_1\Vert{}^2=4$이므로 다음과 같이 정리된다.
>
> $\pi_{U_1}(b_2) = \dfrac{2}{4} \begin{bmatrix} 2 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$
>
> 따라서 $u_2$는 다음과 같다.$u_2 = \begin{bmatrix} 1 \\ 1 \end{bmatrix} - \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$          (검산: $u_1^\top u_2 = 0 \implies u_1 \perp u_2$)

<div class="callout" role="note" data-kind="intuition">

$\operatorname{span}(b_1, b_2) = \operatorname{span}(u_1, u_2)$이고 $u_1 \perp u_2$이므로, 원래 평면은 그대로이고 그 평면을 구성하는 basis만 orthogonal하게 바뀔 것이다.

</div>

</details>

<details>

<summary>

<strong>문제</strong>

</summary>

[Untitled](https://app.notion.com/p/3f009d87213b803792f5c917905f3f4b)

</details>
