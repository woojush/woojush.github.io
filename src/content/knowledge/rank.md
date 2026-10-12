---
title: "Rank"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/linear-maps
status: seed
order: 1
---

> 행렬 $A \in R^{m\times n}$ 의 <strong>선형독립인 열벡터의 최대 개수</strong>.
$\text{rank(A)}$로 표기 \* rank(A) = dim(Im(A))=Pivot의 개수

<details>

<summary>

<strong>왜 필요한가</strong>

</summary>

> 행렬의 크기 (m x n)는 단순히 행과 열의 개수일 뿐이다.
반면 Rank에는 행렬이 실제로 <strong>“몇개의 독립된 정보를 가지고 있는지”</strong> 를 나타내는 숫자이다.

</details>

<details>

<summary>

<strong>직관</strong>

</summary>

> $A∈R^{m×n}$에 대해, $A : \mathbb{R}^n \rightarrow\mathbb{R}^m$으로 벡터를 보내는 함수라고 생각하자.
Rank는 행렬이 <strong>출력 공간에서 만들어낼 수 있는 독립적인 방향의 수</strong>
예를 들어 입력이 100차원이어도 출력이 항상 하나의 평면 위에만 존재한다면 Rank는 2이다.
즉, 살아남은 독립된 정보의 수를 표현한 것.

</details>

<details>

<summary>

<strong>이걸 모르면?</strong>

</summary>

- Column Space / Image
- Kernel / Null Space
- Rank-Nullity Theorem
- 선형방정식의 해 구조
- Invertibility
- SVD
- PCA
- 이해 어려움

</details>

<details>

<summary>

<strong>추가 정보</strong>

</summary>

> <strong>Full Rank</strong> : 가능한 최대의 rank를 가진 행렬 $\text{rank}(A) = \min(m, n)$
<strong>Rank Deficient</strong> : 가능한 최대의 rank보다 rank가 작은 행렬

> <strong>Rank는 Column Space와 Row Space의 차원이며, Gaussian Elimination에서 Pivot의 개수와 같다.</strong>

</details>
