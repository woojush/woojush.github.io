---
title: "Cauch - Schuarz Inequality"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/inner-product-spaces
status: seed
order: 4
---

<details>

<summary><strong>한 줄 정의</strong></summary>

> $|<x,y>| \leq||x||\,\,|y||$
>
> - 두 벡터의 내적의 절댓값은 두 벡터의 길이의 곱을 넘을 수 없다.

</details>

<details>

<summary><strong>왜 필요한가</strong></summary>

> Inner Product와 Norm 사이의 관계를 보장한다.
>
> 특히 $\left\vert{} \dfrac{\langle x,y \rangle}{\vert{}\vert{}x\vert{}\vert{}\, \mathbf{\vert{}\vert{}y\vert{}\vert{}}} \right\vert{} \leq 1$을 보장한다.      ※당장은 무얼 왜 보장한다는지 이해가 안갈지라도 그렇구나 하고 넘어가기.

벡터 간의 <strong>사잇각 </strong>$cos\theta$<strong> </strong>개념을 실수 범위에서 정의할 수 있게 해준다.

</details>

<details>

<summary><strong>증명</strong></summary>

> Inner Product가 만들어내는 norm은 $||x||=\sqrt{<x,x>}$이다. 
따라서 어떤 실수 t에 대해서도 $||x-ty|| \ge 0$이고, $||x-ty||^2 \ge 0$이다.
>
> 이를 내적으로 표현하면 $\text{<x-ty, x-ty>}\ge0$이고
>
> $<x-ty,\, x-ty>\\=\,\,<x,x-ty>-<ty,x-ty>\\=\,\,<x,x>-<x,ty>-(<ty,x>-<ty,ty>)\\=<x,x>-<x,ty>-<ty,x>+<ty,ty>\\=<x,x>-2<x,ty>+<ty,ty>\\=||x||^2-2t<x,y>+||ty||^2\\=||x||^2-2t<x,y>+t^2||y||^2$
>
> 즉 $||x-ty||^2=<x-ty,x-ty>=||x||^2-2t<x,y>+t^2||y||^2$ 이므로,
>
> $||x-ty||\ge0 \rightarrow ||x||^2-2t<x,y>+t^2||y||^2 \ge 0$
>
> t에 관한 이차식 $\ge$ 0 이므로, 판별식 $\dfrac{D}{4}\le0$이어야 한다.    \* $y\neq0$
>
> $\dfrac{D}{4}\le0 \Rightarrow (<x,y>)^2 - ||x||^2||y||^2 \le0$에 의거, 
>
> $\Rightarrow <x,y>^2\,\, \le \,\,||x||^2\,\,||y||^2 \rightarrow |<x,y>| \le ||x||\,\,||y||$

</details>
