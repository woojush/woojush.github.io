---
title: "Cauchy–Schwarz Inequality"
date: 2026-10-11
topic: ai/mathematics/analytic-geometry
status: growing
order: 4
description: "|⟨x,y⟩| ≤ ‖x‖‖y‖. 일반 내적공간에서 사잇각을 정의할 수 있게 해 준다."
tags: [analytic-geometry, inequality]
links:
  - type: knowledge
    slug: inner-product
    rel: prerequisite
---

## 한 줄 정의

$|\langle x,y\rangle| \leq \Vert x\Vert \,\Vert y\Vert$

- 두 벡터의 내적의 절댓값은 두 벡터의 길이의 곱을 넘을 수 없다.

## 왜 필요한가

Inner Product와 Norm 사이의 관계를 보장한다.

특히 $\left\vert  \dfrac{\langle x,y \rangle}{\vert \vert x\vert \vert \, \mathbf{\vert \vert y\vert \vert }} \right\vert  \leq 1$을 보장한다.      ※당장은 무얼 왜 보장한다는지 이해가 안갈지라도 그렇구나 하고 넘어가기.

벡터 간의 **사잇각** $cos\theta$ 개념을 실수 범위에서 정의할 수 있게 해준다.

## 증명

Inner Product가 만들어내는 norm은 $\Vert x\Vert =\sqrt{\langle x,x\rangle }$이다.
따라서 어떤 실수 t에 대해서도 $\Vert x-ty\Vert  \ge 0$이고, $\Vert x-ty\Vert ^2 \ge 0$이다.

이를 내적으로 표현하면 $\langle x-ty, x-ty\rangle \ge0$이고

$$
\begin{aligned}
\langle x-ty,\, x-ty\rangle  &=\,\,\langle x,x-ty\rangle -\langle ty,x-ty\rangle \\
&=\,\,\langle x,x\rangle -\langle x,ty\rangle -(\langle ty,x\rangle -\langle ty,ty\rangle ) \\
&=\langle x,x\rangle -\langle x,ty\rangle -\langle ty,x\rangle +\langle ty,ty\rangle \\
&=\langle x,x\rangle -2\langle x,ty\rangle +\langle ty,ty\rangle \\
&=\Vert x\Vert ^2-2t\langle x,y\rangle +\Vert ty\Vert ^2 \\
&=\Vert x\Vert ^2-2t\langle x,y\rangle +t^2\Vert y\Vert ^2
\end{aligned}
$$

즉 $\Vert x-ty\Vert ^2=\langle x-ty,x-ty\rangle =\Vert x\Vert ^2-2t\langle x,y\rangle +t^2\Vert y\Vert ^2$ 이므로,

$\Vert x-ty\Vert \ge0 \rightarrow \Vert x\Vert ^2-2t\langle x,y\rangle +t^2\Vert y\Vert ^2 \ge 0$

t에 관한 이차식 $\ge$ 0 이므로, 판별식 $\dfrac{D}{4}\le0$이어야 한다.    * $y\neq0$

$\dfrac{D}{4}\le0 \Rightarrow (\langle x,y\rangle )^2 - \Vert x\Vert ^2\Vert y\Vert ^2 \le0$에 의거,

$\Rightarrow \langle x,y\rangle ^2\,\, \le \,\,\Vert x\Vert ^2\,\,\Vert y\Vert ^2 \rightarrow |\langle x,y\rangle | \le \Vert x\Vert \,\,\Vert y\Vert $
