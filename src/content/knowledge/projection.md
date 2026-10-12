---
title: "Projection"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/orthogonality-projection
status: seed
order: 3
---

> x와 informative directions가 span하는 subspace U 사이의 거리가 최소가 되는 점을 찾는다.
>
> 왜 최소여야하느냐? → x와 가장 가까운 U의 점을 선택하면, U라는 제한 때문에 발생하는 정보 손실/변형을 최소화할 수 있다
>
> AI 활용 측면으로 풀어 설명하자면, <strong>“compression loss을 최소화하면서 데이터를 더 작은 표현 공간으로 옮기기 위해서”</strong>

<details>

<summary>

<strong>왜 필요한가?</strong>

</summary>

<details>

<summary>

<strong>고차원 → 저차원</strong>

</summary>

> 머신러닝에는 데이터가 고차원 벡터로 표현되는 경우가 많다. ex. $x \in \R^{1000}$
하지만 고차원 데이터는 분석하거나 시각화하기 어렵다.
그래서 데이터를 더 낮은 차원의 공간으로 옮겨서 다뤄야한다.

</details>

<details>

<summary>

<strong>정보의 손실, compression loss</strong>

</summary>

> 하지만 차원을 줄이면 정보가 손실된다.
가령 $\R^2 \rightarrow \R^1$을 생각해보면,  2차원 데이터 $x=(x_1, x_2)$를 하나의 직선 위에 표현하면 모든 정보를 그대로 보존할 수 없다.
>
> 즉, $원본\,\,데이터 \rightarrow 저차원\,\,데이터$ 과정에서<strong> compression loss</strong>가 발생한다.

</details>

<details>

<summary>

<strong>informative dimension</strong>

</summary>

> 그래서 핵심 문제가 생긴다.
>
> 어떤 저차원 공간을 선택해야 <strong>정보 손실을 최소화</strong>할 수 있는가?
→ <strong>가장 informative한 dimension</strong>을 찾아서 그 방향으로 데이터를 투영한다.
>
> 즉, 단순히 아무 방향으로 차원을 줄이는 게 아니라
$\fbox{정보를\,\,최대한 \,\,보존하는\,\, 저차원 \,\,공간을\,\, 찾는다​}$
>
> ※ projection이 informative dimension을 찾아주는 역할 x, PCA 등의 차원축소 방법의 역할

</details>

<details>

<summary>

<strong>projection</strong>

</summary>

> 찾아낸 informative한 저차원 공간에 고차원 데이터를 옮기는 역할을 하는 것이 바로 projection이다.
>
> $$ \fbox{x $\rightarrow$ $\pi_U$(x) } $$  : 벡터 $x$를 부분공간 $U$에 정사영한 결과 벡터
    ※ $\pi$ : 사영 연산자(Projection operator)를 뜻하는 함수 이름

</details>

<details>

<summary>

<strong>orthogonal projection</strong>

</summary>

>
>
> 같은 저차원 부분공간으로 차원을 줄이더라도 어떤 projection을 사용하는지에 따라 원본과의 오차가 달라질 수 있다.
>
> 특히, 주어진 subspace $U$에 대한 projection 중, <strong>Orthogonal Projection이 원본 </strong>$x$<strong>와 </strong>$U$<strong> 위의 projection 사이의 거리를 최소화</strong>한다.
>
> 앞으로 다루게 될 projection은 모두 orthogonal projection이다.

</details>

</details>

<details>

<summary>

<strong>정의</strong>

</summary>

> Projection은 벡터를 어떤 부분공간 $U$ 위로 보내는 선형변환 $\pi : V \to V$이다.
>
> 이때 $\pi^2 = \pi$를 만족하면 Projection이라고 한다.
>
> 또한, $\pi : V \to V$가 $\pi^2 = \pi$를 만족하는 사영(Projection)일 때, $\pi$가 벡터들을 보내는 목적지(치역)인 부분공간을 $U$라 하면 이를 $\text{Im}(\pi) = U$로 나타낸다.

>
>
> <div class="callout" role="note" data-kind="intuition">
>
> 이때의 $\pi$는 숫자가 아니며, projection을 의미한다.
즉, $\pi^2=\pi\circ \pi$는 <strong>projection 함수 </strong>$\pi$<strong>를 연속해서 두 번 적용하는 합성함수</strong>를 의미한다.
>
> 또한, $\pi^2=\pi$인 이유는 projection을 두번 시행하여도 직관적으로<u><strong> 한 번 Projection해서 </strong></u>$U$<u><strong>에 들어간 벡터는, 다시 Projection해도 변하지 않는다</strong></u>는 Projection의 핵심적인 특징에 의한 것이다.
>
> </div>

> 선형변환은 행렬로 표현될 수 있다. $T(x)=Ax$
Projection도 선형변환이므로 어떤 행렬 $P$로 표현할 수 있다.
>
> $\pi(x)=P_{\pi}x$
>
> 그러면 Projection을 두 번 하는 것은 $\pi(\pi(x))=P_{\pi}(P_{\pi}x)$이고, $=P^2_{\pi}x$가 된다. 
>
> 그런데 Projection의 정의에 의해서 $\pi(\pi(x))=\pi(x)$여야 하니까
$P_\pi^2x=P_\pi x$가 되고, 결국 $\boxed{P_\pi^2=P_\pi}$ 가 된다.

</details>

<details>

<summary>

<strong>1차원 부분공간(Line)에 대한 Projection</strong>

</summary>

![](/images/knowledge/projection/61f13acc.png)

<details>

<summary>

①<strong> projection의 기하학적 조건</strong>

</summary>

> 가장 가까운 점을 찾으므로 원본과 Projection 사이의 오차 $x-\pi_U(x)$는 $U$에 수직이다.
>
> $U=\operatorname{span}(b)$이므로 $\boxed{\langle x-\pi_U(x),b\rangle=0}$ 이다.

</details>

<details>

<summary>

<strong>② projection 벡터 구하기</strong>

</summary>

> $0 = \langle x-\lambda b,b\rangle = \langle x,b\rangle-\lambda\langle b,b\rangle = \langle x,b\rangle-\lambda\Vert{}b\Vert{}^2$이다.
>
> 따라서 $\boxed{\lambda = \frac{\langle x,b\rangle}{\Vert{}b\Vert{}^2}}$이고, $\pi_U(x)=\lambda b$로 표현 가능하므로 $\pi_U(x) = \dfrac{\langle x,b\rangle}{\Vert{}b\Vert{}^2}b$ 이다.

</details>

<details>

<summary>

<strong>③ 기하학적 의미</strong>

</summary>

> 이는 우리가 2차원 좌표평면에서 좌표의 x, y값을 수선의 발을 내려 읽은 것과 동일하다.
벡터 x를 벡터 b에 정사영함으로서, <strong>벡터 x가 벡터 b를 얼마나 가지고 있는지를 알 수 있다.</strong>

> $\mathbb{R}^n$에서 표준 dot product를 사용하면 $\langle x,b \rangle = \Vert{}x\Vert{}\Vert{}b\Vert{}\cos\omega$이므로,

>
> $\pi_U(x) = \dfrac{\Vert{}x\Vert{}\Vert{}b\Vert{}\cos\omega}{\Vert{}b\Vert{}^2}b = \boxed{\Vert{}x\Vert{}\cos\omega\frac{b}{\Vert{}b\Vert{}}}$

>
> 즉,$$ \underbrace{\frac{b}{\Vert{}b\Vert{}}}_{\text{$b$ 방향의 단위벡터}}\quad \underbrace{\Vert{}x\Vert{}\cos\omega}_{\text{$b$ 방향 성분}} $$이므로 정사영은 $x$<strong>의 </strong>$b$<strong> 방향 성분을 벡터로 표현한 것</strong>이다.
>
> 
정사영의 길이는 $\boxed{\Vert{}\pi_U(x)\Vert{} = \Vert{}x\Vert{}\vert{}\cos\omega\vert{}}$이다.

</details>

<details>

<summary>

<strong>④ Projection Matrix</strong>

</summary>

> 표준 dot product에서 $\langle x,b\rangle=b^\top x$이므로$\pi_U(x) = \dfrac{b^\top x}{\Vert{}b\Vert{}^2}b = \dfrac{bb^\top}{\Vert{}b\Vert{}^2}x$         ※ $\underbrace{(b^\top x)}_{\text{숫자}} \cdot \underbrace{b}_{\text{벡터}} = \underbrace{b}_{\text{벡터}} \cdot \underbrace{(b^\top x)}_{\text{숫자}}$ 이므로 $bb^{\top}$이다. 

>
> 따라서 Projection은 행렬 $P_\pi$를 이용하여 $\pi_U(x)=P_\pi x$로 표현할 수 있고,     $\boxed{P_\pi = \frac{bb^\top}{\Vert{}b\Vert{}^2}}$이다.

</details>

<details>

<summary>

<strong>예시</strong>

</summary>

> 벡터 $b=\begin{bmatrix}1&2&2\end{bmatrix}^\top$로 생성되는 원점을 지나는 직선 위로의 사영 행렬 $P$를 구하시오."

<div class="callout" role="note" data-kind="intuition">

$P_{\pi}=\dfrac{bb^{\top}}{b^{\top}b}$이므로, $\dfrac{1}{9} \begin{bmatrix} 1 & 2 & 2 \\ 2 & 4 & 4 \\ 2 & 4 & 4 \end{bmatrix}$

</div>

> 그때의 $x=\begin{bmatrix}1&1&1\end{bmatrix}^\top$에 대하여, $\pi_U(x)$를 구하라.

<div class="callout" role="note" data-kind="intuition">

$\pi_U(x) = P_{\pi}x$ 이므로, $\dfrac{1}{9} \begin{bmatrix} 1 & 2 & 2 \\ 2 & 4 & 4 \\ 2 & 4 & 4 \end{bmatrix}\begin{bmatrix} 1\\1\\1\end{bmatrix}= \dfrac{1}{9} \begin{bmatrix} 5\\10\\10 \end{bmatrix}\in \text{span}[\begin{bmatrix} 1 \\ 2 \\ 2 \end{bmatrix}]$

</div>

</details>

</details>

<details>

<summary>

<strong>일반적인 부분공간 (General Subspaces)에 대한 Projection</strong>

</summary>

<details>

<summary>

배경 직관

</summary>

> $U = \text{span}(b₁,…,bₘ)$이고 $b₁,…,bₘ$이 선형독립(즉 U의 basis)이라면 $\text{dim}(U)=m$이다
여기서, Projection된 벡터 $\pi_U(x)$는 반드시 $U$ 안에 있어야 한다. 
따라서 $U$의 기저를 이용한 선형결합으로 표현할 수 있다.
>
> $$ \fbox{$\pi_U(x) = \lambda_1 b_1 + \dots + \lambda_m b_m$} $$

> 이것을 행렬로 표현하면 훨씬 깔끔해진다.
>
> $B = \begin{bmatrix} \mid & \mid & & \mid \\ b_1 & b_2 & \dots & b_m \\ \mid & \mid & & \mid \end{bmatrix} \in \mathbb{R}^{n \times m}, \,\,\,\,\lambda = \begin{bmatrix} \lambda_1 \\ \lambda_2 \\ \vdots \\ \lambda_m \end{bmatrix}$라고 두면
>
> $$ \fbox{$\pi_U(x) = B\lambda$} $$이다.

> 여기서 중요한 직관은 아래와 같다.
>
> > <strong>“일반적인 부분공간에서의 Projection은 벡터 </strong>$x$<strong>를 공간 </strong>$U$<strong> 안에서 표현했을 때, </strong>$U$<strong>의 기저 벡터들을 어떤 비율로 조합해야 하는지를 찾는 과정이다.”  
                                       </strong><strong>\\</strong>\*기저가 달라지면 조합 비율(계수 $\lambda$)도 달라지지만, 결과물인 사영 벡터 $\pi_U(x)$는 고정된다
>
> - $B$<strong>의 열(column) : </strong>$b_1, \cdots, b_m$<strong> </strong>→ U를 구성하는 기저 방향
> - $\lambda$ → 그 기저 방향을 얼마나 사용할지 나타내는 좌표
> - $B\lambda$ → 실제 $\R^n$ 공간에 존재하는 projection 벡터
>
> 즉, $$ \fbox{$\pi_U(x) = B\lambda$} $$ 라고 생각하면 된다.

</details>

<details>

<summary>

<strong>Normal Equation</strong>

</summary>

<details>

<summary>

<strong>조건</strong>

</summary>

<details>

<summary>

<strong>Projection의 오차 벡터 </strong>$x - \pi_U(x)$<strong>는 </strong>$U$<strong>의 모든 기저벡터에 수직이다.</strong>

</summary>

> Projection은 벡터 $x$를 부분공간 $U$ 위에 가장 가깝게 대응시키는 벡터이다.
따라서 projection된 벡터 $\pi_U(x)$와 $x$ 사이의 오차인 $x - \pi_U(x)$를 $U$의 어떤 방향으로든 더 이동시켜도, $\pi_U(x)$보다 $x$에 더 가까운 점을 만들 수 없어야 한다.
>
> 그러려면 오차 벡터는 $U$ 안의 모든 방향과 수직이어야 한다.
>
> ⇒ $$ \fbox{$x - \pi_U(x) \perp U$} $$
>
> 그리고 부분공간 $U$가 기저 $b_1, \dots, b_m$으로 생성되므로, 다음 관계가 성립한다.
>
> ⇒ $$ \fbox{$\langle x - \pi_U(x), b_i \rangle = 0 \quad (i = 1, \dots, m)$} $$

</details>

</details>

<details>

<summary>

<strong>조건의 결합</strong>

</summary>

> 현재, 일반적인 부분공간 $\R^n$을 다루고 있으므로, 표준 dot product 사용이 가능하다.
>
> $\langle b_i, x - \pi_U(x) \rangle = b_i^\top (x - \pi_U(x))$
>
> 따라서
>
> $$
> \begin{aligned} b_1^\top (x - B\lambda) &= 0 \\ b_2^\top (x - B\lambda) &= 0 \\ &\vdots \\ b_m^\top (x - B\lambda) &= 0 \end{aligned}
> $$
>
> 이다.
>
> ---
>
> ⇒ 
>
> $$
> \begin{bmatrix} b_1^\top \\ b_2^\top \\ \vdots \\ b_m^\top \end{bmatrix} (x - B\lambda) = 0
> $$
>
> 이므로      $$ \fbox{$B^\top (x - B\lambda) = 0$} $$ 가 된다.

</details>

<details>

<summary>

<strong>식 정리</strong>

</summary>

> 식을 전개하면  $B^\top x - B^\top B\lambda = 0,\,\,\,B^\top B\lambda = B^\top x$ 이다.
>
> $$ \fbox{$B^\top B\lambda = B^\top x$} $$
>
> 이것이 바로 <strong>normal equation</strong>(정규방정식)이다. 

<div class="callout" role="note" data-kind="intuition">

\*여기서 normal은 “일반적인”이라는 뜻이 아니다.
기하학에서 <strong>normal = 수직 방향</strong>을 의미한다.

즉, $x - B\lambda$라는 오차 벡터가 $U = \operatorname{col}(B)$에 수직이라는 조건에서 나온 방정식이다.
따라서 $$ \fbox{$B^\top(x-B\lambda)=0$} $$ 이라는 식 자체가 "오차가 $U$에 수직이다"라는 기하학적 조건을 대수적으로 표현한 것이다.

이 연결은 굉장히 중요하다.

</div>

</details>

<details>

<summary>

$\lambda$

</summary>

> $\pi_U(x)=B\lambda$를 구하기 위해 $\lambda$가 필요하다.
>
> 위의 normal equation에 의거, $$ \fbox{$B^\top B\lambda = B^\top x$} $$ 임을 알고 있다.
>
> $\lambda$에 대한 식으로 변형시키면 $$ \fbox{$\lambda = (B^\top B)^{-1}B^\top x$} $$ 이다.
>
> 이때, 이 식이 성립하기 위해선 $(B^{\top}B)^{-1}$이 존재함을 먼저 알아내야한다.
즉, $B^{\top}B$의 invertible을 알아내야한다.

<details>

<summary>

$B^\top B$

</summary>

<details>

<summary>

출발점

</summary>

> 정사각행렬 $A$가 invertible할 필요충분조건은 $A\lambda = 0$의 해가 $\lambda = 0$ 하나뿐인 것이다.
>
> 따라서 $B^\top B$가 invertible인지 확인하려면 $B^\top B \lambda = 0$이 $\lambda = 0$만을 해로 가지는지 확인하면 된다.

</details>

<details>

<summary>

핵심 증명

</summary>

> $B^\top B \lambda = 0$ 양변에 $\lambda^\top$를 곱하면 $\lambda^\top B^\top B \lambda = 0$이다.
>
> 그런데 $\lambda^\top B^\top B \lambda = (B\lambda)^\top (B\lambda) = \Vert{}B\lambda\Vert{}^2$이므로 $\Vert{}B\lambda\Vert{}^2 = 0$이고, 따라서 $B\lambda = 0$이다.
>
> 여기서 $B$의 column들이 $U$의 basis이므로 선형독립이고, 따라서 $B\lambda = 0 \implies \lambda = 0$이다.
>
> ---
>
> 따라서 다음이 모두 동치이다
>
> $B^\top B\lambda=0\iff\Vert B\lambda\Vert^2=0\iff B\lambda=0\iff\lambda=0$

</details>

<details>

<summary>

요약 정리

</summary>

> $B$의 열벡터들이 선형독립이므로 $B\lambda = 0$을 만족하는 $\lambda$는 $\lambda = 0$뿐이다.
>
> 그리고 $\lambda^\top B^\top B \lambda = \Vert{}B\lambda\Vert{}^2$이므로 $B^\top B \lambda = 0$ 역시 $\lambda = 0$만을 해로 갖는다.
>
> 따라서 $B^\top B$는 invertible하다.

</details>

</details>

---

> 쉽게 정리하자면, 행렬 B가 기저 (선형독립 벡터의 집합)이므로,
따라서 $$ \fbox{$\lambda = (B^\top B)^{-1}B^\top x$} $$이다.

</details>

</details>

<details>

<summary>

<strong>Projection Matrix</strong>

</summary>

> 우리가 원하는 것은 $\pi_U(x) = P_\pi x$ 형태였다.
그런데 방금 $\pi_U(x) = B(B^\top B)^{-1}B^\top x$를 얻었으므로$$ \fbox{$P_\pi = B(B^\top B)^{-1}B^\top$} $$이다.

</details>

<details>

<summary>

<strong>Projection Error</strong>

</summary>

> Projection error는 원래 벡터 $x$와 그 projection $\pi_U(x)$ 사이의 차이로,
$U$로 projection하고 남은 오차 벡터(residual)이다.
>
> $$ \fbox{$e = x - \pi_U(x)$} $$
>
> ---
>
> 그리고 projection error의 norm은 $x$와 부분공간 $U$ 사이의 최소거리를 의미한다.
>
> $$ \fbox{$\Vert{}e\Vert{} = \Vert{}x - \pi_U(x)\Vert{} = \operatorname{dist}(x, U)$} $$
>
> ---
>
> 여기에 하나만 더 기억하면 충분하다.
>
> $$ \fbox{e$\perp$U} $$    즉, projection error는 $U$에 직교한다.
>
> 그래서 전체적으로는$x = \pi_U(x) + e$로 볼 수 있고, 
이는 벡터 $x$를 직교하는 두 개의 성분으로 분해한 것이다.
>
> $x = (U\text{가 설명하는 부분}) + (U\text{가 설명하지 못한 부분})$

</details>

<details>

<summary>

예시

</summary>

> 다음 부분공간과 벡터가 주어졌다고 하자.
>
> $U = \operatorname{span} \left\{ \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}, \begin{bmatrix} 0 \\ 1 \\ 2 \end{bmatrix} \right\} \subseteq \mathbb{R}^3, \qquad x = \begin{bmatrix} 6 \\ 0 \\ 0 \end{bmatrix}$
>
> 구할 것은 다음 세 가지이다.
>
> - Projection된 벡터 $\pi_U(x)$를 $U$의 basis $B$로 표현하기 위한 좌표 $\lambda$
> - $x$의 $U$ 위 정사영점 $\pi_U(x)$
> - Projection matrix $P_\pi$

<div class="callout" role="note" data-kind="intuition">



<details>

<summary>

① Projection된 벡터 $\pi_U(x)$를 $U$의 basis $B$로 표현하기 위한 좌표 $\lambda$

</summary>

> $B^{\top}(x-\pi_U(x))=B^{\top}(x-B\lambda)=0 \,\,\rightarrow B^{\top}x=B^{\top}B\lambda \cdots ①$ 이므로, 제시된 벡터에 대해 식을 정리하여 풀면 된다.
>
> $U = \operatorname{span} \left\{ \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}, \begin{bmatrix} 0 \\ 1 \\ 2 \end{bmatrix} \right\}$이므로 공간 $B$ 를 구성하는 기저벡터 $b_1, b_2$에 대하여 정리하면
>
> 행렬 $B=\begin{bmatrix} 1&0 \\ 1&1 \\ 1&2\end{bmatrix}$이다.
>
> 따라서 ①의 양변을 정리해보면,
>
> $B^\top x = \begin{bmatrix} 1 & 1 & 1 \\ 0 & 1 & 2 \end{bmatrix} \begin{bmatrix} 6 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 6 \\ 0 \end{bmatrix}$
>
> $B^\top B = \begin{bmatrix} 1 & 1 & 1 \\ 0 & 1 & 2 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 1 & 1 \\ 1 & 2 \end{bmatrix} = \begin{bmatrix} 3 & 3 \\ 3 & 5 \end{bmatrix}$이며, 방정식은 아래와 같다.
>
> $\begin{bmatrix} 6 \\ 0 \end{bmatrix} = \begin{bmatrix} 3 & 3 \\ 3 & 5 \end{bmatrix} \begin{bmatrix} \lambda_1 \\ \lambda_2 \end{bmatrix} \,\rightarrow \begin{bmatrix} 3 & 3 & \mid & 6 \\ 3 & 5 & \mid & 0 \end{bmatrix}\,\rightarrow \begin{bmatrix} 1 & 0 & \mid & 5 \\ 0 & 1 & \mid & -3 \end{bmatrix}\Rightarrow \lambda = \begin{bmatrix} \lambda_1 \\ \lambda_2 \end{bmatrix} = \begin{bmatrix} 5 \\ -3 \end{bmatrix}$

</details>

<details>

<summary>

② $x$의 $U$ 위 정사영점 $\pi_U(x)$

</summary>

> $\pi_U(x)=B\lambda$이므로, $B\lambda = \begin{bmatrix} 1 & 0 \\ 1 & 1 \\ 1 & 2 \end{bmatrix} \begin{bmatrix} 5 \\ -3 \end{bmatrix} = \begin{bmatrix} 5 \\ 2 \\ -1 \end{bmatrix}$

</details>

<details>

<summary>

③ Projection matrix $P_\pi$

</summary>

>
>
> $$
> \begin{cases} \lambda = (B^\top B)^{-1} B^\top x \\ \pi_U(x) = B\lambda \\ \pi_U(x) = P_\pi x \end{cases} \implies P_\pi = B(B^\top B)^{-1} B^\top
> $$
>
> 식 정리시, $P_{\pi}$는 아래와 같다.
>
> $$
> P_\pi = \frac{1}{6} \begin{bmatrix} 5 & 2 & -1 \\ 2 & 2 & 2 \\ -1 & 2 & 5 \end{bmatrix}
> $$

</details>

<details>

<summary>

\+) norm of projection error

</summary>

> $\Vert{}x - \pi_U(x)\Vert{} = \left\Vert{} \begin{bmatrix} 6 \\ 0 \\ 0 \end{bmatrix} - \begin{bmatrix} 5 \\ 2 \\ -1 \end{bmatrix} \right\Vert{} = \left\Vert{} \begin{bmatrix} 1 \\ -2 \\ 1 \end{bmatrix} \right\Vert{} = \sqrt{1^2 + (-2)^2 + 1^2} = \sqrt{6}$

</details>

</div>

</details>

<details>

<summary>

주의점 및 추가 지식

</summary>

<details>

<summary>

① Projection된 벡터의 <strong>차원과 좌표 표현</strong>

</summary>

> Projection은 벡터를 더 작은 공간 $U$에 위치시키지만, 벡터 자체가 존재하는 ambient space $\mathbb{R}^n$이 바뀌는 것은 아니다.
>
> 다만 $U$의 basis를 알고 있다면 그 벡터를 지정하는 데 필요한 자유도는 $m$개뿐이므로, $m$개의 좌표 $\lambda$로 표현할 수 있다.

</details>

<details>

<summary>

② 일반적인 Inner Product에서는 <strong>거리와 각도를 조심해야 한다</strong>

</summary>

> 앞에서는 주로 일반적인 dot product를 사용했지만, inner product가 $\langle x, y \rangle = x^\top A y$와 같은 일반적인 형태라면 벡터의 길이와 각도의 정의가 달라질 수 있다.
>
> 따라서 projection을 계산하거나 기하학적으로 해석할 때는 어떤 inner product를 사용하고 있는지 확인해야 한다.

</details>

<details>

<summary>

③ Projection은 <strong>풀 수 없는 선형방정식의 근사해</strong>를 구하는 데 사용된다

</summary>

> 선형방정식 $Ax = b$에서 $b \notin \operatorname{col}(A)$이면 $Ax = b$를 정확히 만족하는 해가 존재하지 않는다.
>
> 이때 $b$를 $\operatorname{col}(A)$에 정사영하여 $b$에 가장 가까운 벡터 $A\hat{x}$를 찾는다. 이때 $\hat{x}$가 least-squares solution이다.
>
> $$ \fbox{$A\hat x=π_{col(A)}​(b)​$} $$

</details>

<details>

<summary>

④ Reconstruction Error는 <strong>PCA로 연결된다</strong>

</summary>

> Projection하면 $e = x - \pi_U(x)$라는 reconstruction error가 생긴다.
>
> 데이터를 저차원 부분공간 $U$에 projection할 때 reconstruction error를 최소화하는 부분공간 $U$를 찾는 것이 $\text{PCA}$의 핵심이다. 중심화된 데이터에서는 이것이 데이터의 분산이 가장 큰 방향들을 찾는 것과 동치이다. 
>
> $$ \fbox{$\text{Projection} \to \text{Reconstruction Error 최소화} \to \text{최적 부분공간 탐색} \to \text{PCA}$} $$

</details>

<details>

<summary>

⑤ <strong>B가 ONB라면 계산이 훨씬 간단해진다</strong>

</summary>

> $B$의 column들이 orthonormal basis(ONB)이면 $B^\top B = I$이므로 일반적인 projection 식
>
> $\pi_U(x) = B(B^\top B)^{-1}B^\top x$가   $\boxed{\pi_U(x) = BB^\top x}$  로 단순화되며,
projection된 벡터의 $U$-basis 좌표 역시 $\boxed{\lambda = B^\top x}$  로 바로 구할 수 있다.

</details>

</details>

</details>

<details>

<summary>

<strong>문제</strong>

</summary>

[Untitled](https://app.notion.com/p/3f009d87213b80f7b868f4361507c17a)

[Untitled](https://app.notion.com/p/3f009d87213b8062ad4de0564074ab23)

</details>
