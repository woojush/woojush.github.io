---
title: "Kernel (Null Space)"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/linear-maps
status: seed
order: 3
---

> 행렬 $A$에 대해 $Ax=0$을 만족하는 모든 벡터들의 집합을 Kernel 또는 Null Space라고 한다.

$\text{ ker(A)=} \{x \in R^n | Ax=0\}$ 

\*$Ax=0$을 동차방정식, $\text{Homogeneous}$라 하며 $Ax=b \,\,(b \neq 0)$는 $\text{Inhomogeneous}$라 한다.

<details>

<summary>

<strong>왜 필요한가?</strong>

</summary>

> Rank가 “살아남는 정보”를 의미한다면, Kernel은 “사라지는 정보”를 의미한다.
즉, 어떤 입력이 행렬 A와 만났을 때 정보성을 잃는지 알려준다.
더 나아가서는 서로 다른 입력을 구별하지 못하게 만드는 입력의 집합.

</details>

<details>

<summary>

<strong>직관</strong>

</summary>

> 행렬을 하나의 정보 변환기로 생각해보자. 
$$ \fbox{입력 x$\xrightarrow{A}Ax$} $$ 처럼, 대부분의 입력은 어떤 출력을 만든다.
하지만 어떤 특별한 입력들은 $$ \fbox{입력 x$\xrightarrow{A}0$} $$ 이 되어버린다.
이 입력들의 집합이 바로 Kernel이다.

ex) $A=\begin{bmatrix}1&1\\2&2\end{bmatrix}, Ax=0 \rightarrow x_1=-x_2$, 모든 해는 $x=t\begin{bmatrix}1\\-1\end{bmatrix}$이다.
즉, $\text{ker(A)} = \text{span }\{ \begin{bmatrix}1\\-1\end{bmatrix}\}$이다. ⇒ $\begin{bmatrix}1\\-1\end{bmatrix}$ 방향의 입력은 $A$를 통과하면 0으로 사라진다.

<details>

<summary>

<strong>이걸 모르면?</strong>

</summary>

- Rank-Nullity
- 해의 유일성
- Least Squares
- SVD
- 가 어려움

</details>

</details>
