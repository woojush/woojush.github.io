---
title: "Rank-Nullity"
date: 2026-10-11
topic: ai/mathematics/linear-algebra
status: growing
order: 4
description: "입력 차원 = Rank + Kernel의 차원. 입력 정보가 어떻게 나뉘는지 알려주는 정리."
tags: [linear-algebra, rank]
links:
  - type: knowledge
    slug: rank
    rel: prerequisite
  - type: knowledge
    slug: kernel
    rel: prerequisite
---

입력공간의 차원은 “출력에 영향을 주는 방향”과 “출력에 영향을 주지 않는 방향”으로 정확히 나뉜다.
즉, $\text{n=rank(A)+dim(ker(A))}$
*열의 개수 = Pivot의 개수 + Free Variable의 개수

> **왜 Free Variable의 개수가 Kernel의 차원인가?**
> 자유변수가 1개이면 $x=t\begin{bmatrix}1\\-1\\2\end{bmatrix}$같은 꼴. 여기서는 t만 마음대로 조정 가능.
> 따라서 Kernel 안에서 독립적으로 움직일 수 있는 방향이 1개이다.
> $\ker(A) = \text{span}\left\{ \begin{bmatrix} 1 \\ -1 \\ 2 \end{bmatrix} \right\}$.
> 따라서 $\dim(\ker A) = 1$이다.
>

## 왜 필요한가?

**입력의 정보가 어떻게 분배되는지**를 알려주는 가장 중요한 정리이다.

## 직관

변수가 $x_1$~$x_5$인 행렬을 가우스 소거했더니, Pivot이 $x_1$, $x_2$ 2개이다. → $x_3$~$x_5$는 Free Variable이다.
즉, **전체 변수가5개 = Pivot 변수 2개 + Free Variable 3개**인 것이며,
이는 곧 $\fbox{입력차원 = Rank + Kernel의 차원}$과 같다.

## 이걸 모르면?
- Image
- Orthogonality
- SVD
- PCA
- Least Squares
- 어려움.

## 추가정보
- $\text{nullity(A)}=\dim(\ker A) = \text{Kernel의 basis vector 개수} = \text{ Free Variable 개수} = n - \text{rank}(A)$
