---
title: "Projection onto Affine Subspaces"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/orthogonality-projection
status: seed
order: 5
---

> $$ \fbox{$\pi_L(x) = x_0 + \pi_U(x - x_0)$} $$

<details>

<summary>

<strong>Affine Subspace</strong>

</summary>

> $L = x_0 + U$
>
> - $U$: direction space — 공간의 방향을 결정
> - $x_0$: support point — 공간의 위치를 결정

</details>

<details>

<summary>

<strong>핵심 아이디어</strong>

</summary>

> 현재까지 다룬 projection은 모두 공간이 원점을 지나는, vector space에서의 projection이었다.
하지만 실제로는 공간이 원점을 지나지 않는 경우에서 projection을 하게 되는 경우도 빈번하다.
그럼 그런 경우에는 projection의 연산을 어떻게 처리할 것이냐는 것이다.

>
>
> Affine projection은 새로운 공식을 만드는 것이 아니라 <strong>원래 알던 문제로 바꿔서 해결</strong>한다.
>
> $L = x_0 + U$ 이므로 $x_0$만큼 뒤로 이동하면 $L - x_0 = U$가 되어 원점을 지나는 공간이 된다.
>
> \*$U$ : vector space, 원점을 포함한 공간   /   $x_0$ : 스칼라
>
> <div class="callout" role="note" data-kind="intuition">
>
>
>
> $$
> x \xrightarrow{-x_0} x-x_0 \xrightarrow{\pi_U} \pi_U(x-x_0) \xrightarrow{+x_0} \pi_L(x)
> $$
>
> Affine subspace $L = x_0 + U$로의 사영은 기존 벡터 공간에서의 사영과 다르다.
>
> $L$이 벡터 공간 $U$를 $x_0$만큼 평행이동한 공간임을 이용해, 먼저 벡터 $x$에서 $x_0$를 뺀 $(x - x_0)$를 $U$에 사영 내린다.
>
> 이후 해당 사영 벡터에 다시 $x_0$를 더해 $L$ 위의 사영점 $\pi_L(x) = x_0 + \pi_U(x - x_0)$를 구한다.
>
> </div>
>
> <details>
>
> <summary>
>
> 인터렉티브 그래픽
>
> </summary>
>
>
> </details>
>
> > <strong>이동 </strong>$\rightarrow$<strong> 기존 Projection </strong>$\rightarrow$<strong> 원래 위치로 복원</strong>

</details>

<details>

<summary>

<strong>왜 필요한가?</strong>

</summary>

>
>
> Vector subspace는 항상 원점($0 \in U$)을 포함해야 한다.
하지만 현실에서 관심 있는 평면이나 직선이 반드시 원점을 지나는 것은 아니다.
>
> 앞으로 AI/ML에서 affine transformation이나 데이터 중심화 등을 만났을 때 <strong>공식을 다시 유도할 수 있는 기준점</strong>이 된다.
>
> 특히 중요한 것은 공식을 외우는 것이 아니라:
>
> $x - x_0 \rightarrow \text{원점을 기준으로 문제 해결} \rightarrow +x_0$
>
> 라는 구조다.

</details>

<details>

<summary>

<strong>Projection Error의 직교성</strong>

</summary>

$$ \fbox{$x - \pi_L(x) \perp U$} $$

- $L = x_0 + U$는 $U$를 평행이동한 공간이므로, $L$의 방향성은 곧 $U$와 동일(평행)하다.
- 따라서 $L$ 위로 내린 사영 오차 벡터 $x - \pi_L(x)$는 <strong>방향 공간인 </strong>$U$<strong>의 모든 벡터와 직교</strong>한다 $x - \pi_L(x) \in U^\perp$.



</details>
