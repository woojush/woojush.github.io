---
title: "Orthogonal / Orthonormal / Orthogonal Matrix"
date: 2026-10-11
topic: mathematics/analytic-geometry
status: growing
order: 6
description: "직교·정규직교의 정의와, 길이·각도를 보존하는 직교행렬."
tags: [analytic-geometry, orthogonality]
links:
  - type: knowledge
    slug: angle-and-cosine
    rel: prerequisite
---

## Orthogonal

두 벡터가 서로 직교 ⇒ $\langle x,y\rangle =0$

ex. $\begin{bmatrix}1\\1\end{bmatrix},\begin{bmatrix}-1\\1\end{bmatrix}$

## Orthonormal

서로 직교 + 각각 길이가 1 ⇒ $\langle x,y\rangle =0,\,\,\Vert x\Vert =\Vert y\Vert =1$

ex. $\begin{pmatrix} \frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}} \\ \frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \end{pmatrix} = \frac{1}{\sqrt{2}} \begin{pmatrix} 1 & -1 \\ 1 & 1 \end{pmatrix}$

## Orthogonal Matrix

**Orthonormal한 열벡터들이 모인 정방행렬 ⇒** $A^\top A=I$

그리고 따라서 $\Vert Ax\Vert =\Vert x\Vert $이므로 벡터의 방향은 회전/반사에 의해 바뀔 수 있지만, 길이·거리·각도는 변하지 않는다.
즉, **변환에서 벡터의 길이는 보존**된다. 또한 거리와 각도도 보존되어, 기하적으로 <strong>회전(rotation) 또는 반사(reflection)</strong>를 나타낸다.
