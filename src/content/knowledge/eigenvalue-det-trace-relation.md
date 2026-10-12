---
title: "고유값 · det · trace의 관계"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/eigen-theory
status: seed
order: 3
---

<details>

<summary>

$\det(A)=\prod_{i=1}^{n}\lambda_i$  (고유값의 곱 = 행렬식)

</summary>

> 행렬식은 선형변환의 부피 배율을 나타내고, 고윳값은 고유벡터 방향으로의 스케일링을 나타냄.
고유벡터들로 기저를 구성할 수 있는 경우, 각 방향의 스케일링을 모두 곱하면 전체 부피 배율이 되므로 이 관계를 직관적으로 이해할 수 있다.

</details>

<details>

<summary>

$\text{tr}(A)=\sum_{i=1}^{n}\lambda_i$ (고유값의 합 = 대각합)

</summary>

> 고윳값의 합은 행렬의 대각합과 같다. 정리로 받아들이고 활용에 익숙해진다.

</details>

<details>

<summary>

<strong>직관 (교재 Figure 4.6)</strong>

</summary>

> $A\in\mathbb{R}^{2\times2}$의 고유벡터 $x_1,x_2$가 <strong>정규직교기저</strong>라고 하자. 이들이 만드는 정사각형의 넓이는 1이다.
A를 곱하면 $x_i$는 $\lambda_ix_i$가 되고, 두 벡터는 여전히 직교하므로 새 도형은 <strong>변의 길이가 </strong>$|\lambda_1|,|\lambda_2|$<strong>인 직사각형</strong>이다.
• 넓이 배율 $=|\lambda_1\lambda_2|=|\det(A)|$
• 둘레 : $2(1+1)\to2(|\lambda_1|+|\lambda_2|)$, 즉 고유값의 크기 합이 둘레의 변화를 알려준다.

<div class="callout" role="note" data-kind="intuition">

4.1에서 det를 “부피 배율”이라 했다. 고유벡터 방향으로 잡은 축은 서로 간섭 없이 <strong>각각 </strong>$\lambda_i$<strong>배</strong>로 늘어나므로, 부피 배율이 그 곱이 되는 것은 당연하다.

</div>

</details>

<details>

<summary>

<strong>이걸 모르면?</strong>

</summary>

- 고유값으로 invertibility 판정 ($\lambda=0$이 있으면 invertible 아님)
- 이해 어려움

</details>
