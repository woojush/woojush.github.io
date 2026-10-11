---
title: "Angle & Cosine"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/inner-product-spaces
status: seed
order: 5
---

<details>

<summary>$\R^2, \R^3$</summary>

> $\R^2, \R^3$에서 <strong>일반적인 Euclidean geometry의 Dot Product를 사용할 때 </strong>다음이 성립한다.
>
> $cos\theta=\dfrac{<x,y>}{||x||\,||y||}\,\,(x,y\neq0)$

<details>

<summary><strong>증명</strong></summary>

![](/images/knowledge/angle-and-cosine/2b29d26e.png)

$c^2 = (a \sin \theta)^2 + (b - a \cos \theta)^2 = a^2 + b^2 - 2ab \cos \theta$

여기서 $\mathbf{x} - \mathbf{y}$는 두 벡터 끝점을 시작과 끝으로 하는 
연결하는 변위 벡터이고, 그 Norm인 $\Vert\mathbf{x}-\mathbf{y}\Vert$가 두 끝점 사이의 거리이므로 코사인 법칙을 적용하면 다음과 같은 식을 얻을 수 있다.


$\Vert{}\mathbf{x} - \mathbf{y}\Vert{}^2 = \Vert{}\mathbf{x}\Vert{}^2 + \Vert{}\mathbf{y}\Vert{}^2 - 2\Vert{}\mathbf{x}\Vert{}\Vert{}\mathbf{y}\Vert{}\cos \theta \quad \cdots (1)$

(1) 식의 좌변 $\Vert{}\mathbf{x} - \mathbf{y}\Vert{}^2$를 다르게 풀어 써보면 아래와 같이 된다.
$∥x−y∥^2\\=⟨x−y,x−y⟩\\=⟨x,x⟩−⟨x,y⟩−⟨y,x⟩+⟨y,y⟩\\=∥x∥^2−2⟨x,y⟩+∥y∥^2 \quad \cdots (2)$ 

(1)과 (2)를 통해서 최종적으로 내적 공식이 도출된다.
$\therefore \mathbf{x} \cdot \mathbf{y} = \Vert{}\mathbf{x}\Vert{}\Vert{}\mathbf{y}\Vert{}\cos \theta$   ( ⟨x,y⟩=x⋅y )
즉, 내적은 두 벡터의 크기와 방향의 관계를 함께 나타낸다.

이를 벡터의 크기로 정규화하면 방향의 유사성을 나타내는 Cosine Similarity가 된다.

</details>

</details>

<details>

<summary><strong>일반적인 Inner Product Space</strong></summary>

>
>
> Dot Product를 일반화한 Inner Product를 사용해서 $\cos \omega \stackrel{?}{=} \dfrac{\langle \mathbf{x}, \mathbf{y} \rangle}{\|\mathbf{x}\| \|\mathbf{y}\|}$라고 정의하고 싶다.
>
> 그런데 이 식의 우변을 cosine이라고 부르려면, 적어도 그 값이 cosine이 가질 수 있는 범위인 \[-1,1\] 안에 있어야 한다.
Cauchy–Schwarz가 바로 이것을 보장한다.
>
> <details>
>
> <summary>어케 보장하는지 직관적 이해 - <strong>값의 범위에 따른 분석</strong></summary>
>
> > 1. <strong>분모와 분자가 같을 때 (등호 성립 조건: </strong>$x,y$<strong>가 선형종속 관계일 때) </strong>$\Vert{}x\Vert{} \Vert{}y\Vert{} = \vert{}\langle x, y \rangle\vert{}$
> >
> > - $\langle x, y \rangle > 0 \implies \cos \omega = 1 \implies \omega = 0$ (두 벡터가 같은 방향)
> > - $\langle x, y \rangle < 0 \implies \cos \omega = -1 \implies \omega = \pi$ (두 벡터가 반대 방향)
> >
> > <details>
> >
> > <summary><strong>왜 </strong>$\Vert{}x\Vert{} \Vert{}y\Vert{} = \vert{}\langle x, y \rangle\vert{}$인 경우가 <strong> </strong>$x,y$<strong>가 선형종속 관계</strong>인가?</summary>
> >
> > > $<x,y>$가 의미하는건, $\fbox{$ 한 \,\,벡터의 \,\,길이 \times 다른 벡터가\,\, 그 방향에 \,\,기여하고 \,\,있는 \,\,정도$}$ 를 나타내는 거임.
이때, 한 벡터의 길이가 $||x||$를 의미한다면, 다른 벡터가 그 방향에 기여하고 있는 정도는 $||\pi_x(y)||$.
즉, 사영을 내린 벡터의 norm : 벡터 y가 벡터 x의 방향에 기여하고 있는정도.
> > >
> > > 근데 사영한 벡터의 길이와 그냥 그 사영을 내리는 출발점의 벡터(y)의 길이가 서로 같다면 뭐겠음?
이미 y가 x안에 속해있다! 이거겠지.
그래서 $cos(\theta) =\pm1$인 경우는, 현재 내적하는 두 벡터가 서로 종속적인 관계구나 이렇게 보면 됨.
> >
> > </details>
> >
> > ---
> >
> > 1. <strong>분모가 분자보다 클 때 (엄밀한 부등식 성립: </strong>$x,y$<strong>가 선형독립 관계일 때) </strong>$\Vert{}x\Vert{} \Vert{}y\Vert{} > \vert{}\langle x, y \rangle\vert{}$
> > - 분모가 최소 범위인 $\vert{}\langle x, y \rangle\vert{}$보다 커지므로, 전체 분수식의 절댓값은 $1$보다 작아진다.
> > - $-1 < \dfrac{\langle x, y \rangle}{\Vert{}x\Vert{} \Vert{}y\Vert{}} < 1$
>
> </details>
>
> $\vert{}\langle \mathbf{x}, \mathbf{y} \rangle\vert{} \leq \Vert{}\mathbf{x}\Vert{} \Vert{}\mathbf{y}\Vert{}$,   따라서$-1 \leq \dfrac{\langle \mathbf{x}, \mathbf{y} \rangle}{\Vert{}\mathbf{x}\Vert{} \Vert{}\mathbf{y}\Vert{}} \leq 1$
>
> 따라서 일반적인 Inner Product Space에서도    $\boxed{\cos\omega = \frac{\langle \mathbf{x},\mathbf{y}\rangle}{\|\mathbf{x}\|\|\mathbf{y}\|} = \frac{\langle \mathbf{x},\mathbf{y}\rangle}{\sqrt{\langle \mathbf{x},\mathbf{x}\rangle \langle \mathbf{y},\mathbf{y}\rangle}}}$  로 Angle을 정의할 수 있다.

</details>

<details>

<summary><strong>문제</strong></summary>

[Untitled](https://app.notion.com/p/3ee09d87213b80daab83f907a0a110fd)

</details>
