---
title: "Orthogonal / Orthonormal / Orthogonal Matrix"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/orthogonality-projection
status: seed
order: 1
---

<details>

<summary>

<strong>Orthogonal</strong>

</summary>

> 두 벡터가 서로 직교 ⇒ $⟨x,y⟩=0$

ex. $\begin{bmatrix}1\\1\end{bmatrix},\begin{bmatrix}-1\\1\end{bmatrix}$

</details>

<details>

<summary>

<strong>Orthonormal</strong>

</summary>

> 서로 직교 + 각각 길이가 1 ⇒ $⟨x,y⟩=0,\,\,∥x∥=∥y∥=1$

ex. $\begin{pmatrix} \frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}} \\ \frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \end{pmatrix} = \frac{1}{\sqrt{2}} \begin{pmatrix} 1 & -1 \\ 1 & 1 \end{pmatrix}$

</details>

<details>

<summary>

<strong>Orthogonal Matrix</strong>

</summary>

>
>
> <strong>Orthonormal한 열벡터들이 모인 정방행렬 ⇒ </strong>$A^⊤A=I$
>
> 그리고 따라서 $∥Ax∥=∥x∥$이므로 벡터의 방향은 회전/반사에 의해 바뀔 수 있지만, 길이·거리·각도는 변하지 않는다.
즉, <strong>변환에서 벡터의 길이는 보존</strong>된다. 또한 거리와 각도도 보존되어, 기하적으로 <strong>회전(rotation) 또는 반사(reflection)</strong>를 나타낸다.

</details>
