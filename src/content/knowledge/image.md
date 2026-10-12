---
title: "Image"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/linear-maps
status: seed
order: 2
---

> 선형사상 $A: \mathbb{R}^n \to \mathbb{R}^m$이 만들어낼 수 있는 모든 출력의 집합이다.$\\\text{행렬 } A = [a_1, \dots, a_n]$ 의 관점에서는 각 열벡터의 선형결합이 Image이다.
그런 관점에서 $\text{Im}(A) = \text{Col}(A) = \text{span}(a_1, \dots, a_n)$이다.
>
> \*$Ax = x_1 a_1 + x_2 a_2 + \dots + x_n a_n$이기 때문에 $\text{Image}$가 열벡터들의 $\text{span}$이 되는 것이다.

<details>

<summary>

<strong>왜 필요한가?</strong>

</summary>

> 선형방정식 $Ax=b$가 풀리려면 반드시 $b \in Image(A)$이어야 한다.
즉, 도달할 수 없는 b는 절대로 만들 수 없다.

</details>

<details>

<summary>

<strong>직관</strong>

</summary>

> $Image$는 <strong>“행렬이 만들어낼 수 있는 모든 출력의 집합”</strong>이다.
입력을 아무리 바꾸어도 $Image$ 밖으로는 절대 나갈 수 없다.
따라서 <u>Rank</u>는 "<strong>Image가 몇 차원짜리 공간인가</strong>"를 나타낸다.

</details>

<details>

<summary>

<strong>이걸 모르면? </strong>

</summary>

- 해 존재 조건 \*rank(A)=rank(\[A\|b\])
- Rank-Nullity
- 이해 어려움

</details>

<details>

<summary>

<strong>추가정보</strong>

</summary>

> <strong>Image의 차원이 Rank이다.
</strong>$\text {dim(Im(A))=rank(A)}$
또한 이는 <strong>Pivot의 개수</strong>와 같다.

</details>
