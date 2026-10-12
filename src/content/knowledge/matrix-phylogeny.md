---
title: "Matrix Phylogeny (행렬의 계통도)"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/matrix-decompositions
status: seed
order: 8
---

<div class="callout" role="note" data-kind="note">

<strong>이어받는 질문</strong> : 어떤 행렬에 어떤 분해가 되는가?

<strong>핵심 아이디어</strong> : 행렬의 종류는 포함 관계로 이어져 있고, 조건이 좁아질수록 쓸 수 있는 도구가 늘어난다. 조건이 없는 SVD에서 시작해 정사각 $\to$ non-defective(고유분해) $\to$ 대칭(직교 고유기저) $\to$ PD(Cholesky) 순으로 좁아진다.

</div>

> <strong>교재 4.7</strong> : 지금까지 본 행렬의 종류는 서로 <strong>포함 관계</strong>로 이어져 있다. 종류가 좁아질수록 쓸 수 있는 연산이 늘어난다. (Figure 4.13) 이 노트는 4장을 한 장의 지도로 정리한다.

<details>

<summary>

<strong>계통도 표</strong>

</summary>

| 종류 | 조건 | 포함 관계 | 쓸 수 있는 것 |
| --- | --- | --- | --- |
| 모든 실행렬 | $A\in\mathbb R^{m\times n}$ | — | <strong>SVD</strong> (4.5) |
| 정사각행렬 | $m=n$ | ⊂ 모든 실행렬 | det, trace (4.1) |
| 정칙(regular) | $\det\neq0$ | ⊂ 정사각 | 역행렬 |
| 특이(singular) | $\det=0$ | ⊂ 정사각 | 역행렬 없음 |
| non-defective | 독립 고유벡터가 $n$개 | ⊂ 정사각 | <strong>고유분해</strong> (Theorem 4.20) |
| defective | 독립 고유벡터가 $n$개 미만 | ⊂ 정사각 | 대각화 불가 (Definition 4.13) |
| 정규(normal) | $A^\top A=AA^\top$ | ⊂ non-defective | — |
| 직교(orthogonal) | $A^\top A=AA^\top=I$ | ⊂ 정규, ⊂ 정칙 | $A^{-1}=A^\top$ (회전 포함) |
| 대칭(symmetric) | $S=S^\top$ | ⊂ 정규 | 고유값이 모두 실수 · 정규직교 고유기저 (Spectral Theorem) |
| 양의 정부호(PD) | $x^\top Px>0\;(x\neq0)$ | ⊂ 대칭 | <strong>Cholesky</strong> (Theorem 4.18) · 고유값 $>0$ · 항상 가역 |
| 대각(diagonal) | 비대각 성분이 0 | ⊂ 대칭 | 덧셈·곱셈에 닫혀 있다. |
| 단위행렬 $I$ | 대각 성분이 모두 1인 대각행렬 | 특수한 대각행렬 | — |

<div class="callout" role="note" data-kind="stuck">

교재 Figure 4.13에는 “정규행렬 ⊂ non-defective”로 그려져 있다. 다만 실수에서는 회전행렬처럼 정규이면서 <strong>실수 고유값이 없어 실수로는 대각화되지 않는</strong> 행렬이 있다. 교재도 같은 예(회전행렬은 가역이지만 실수 범위에서 대각화 불가)를 든다.

</div>

</details>

<details>

<summary>

<strong>교재가 직접 말하는 구분</strong>

</summary>

> • <strong>정칙(non-singular)과 non-defective는 다르다.</strong> 회전행렬은 $\det\neq0$이라 가역이지만 실수에서 대각화되지 않는다.
• 직교·대칭·PD 행렬의 성질은 위 표의 해당 행과 같다.
• <strong>대각행렬은 덧셈·곱셈에 닫혀 있지만 군(group)이라고는 할 수 없다.</strong> 모든 대각 성분이 0이 아닐 때(가역일 때)만 군이 된다.

</details>

<details>

<summary>

<strong>어떤 분해를 쓸까? 질문 순서 (교재 밖 정리)</strong>

</summary>

> ※ 교재 밖 보충 : 위 표를 사용 순서로 바꾼 것이다.
1. 정사각이 아니다 → <strong>SVD</strong>
2. 정사각이다 → $\det$로 가역 여부를 본다.
3. 독립 고유벡터가 $n$개인가? → 그렇다면 <strong>고유분해</strong>, 아니라면 defective이다.
4. 대칭인가? → 그렇다면 <strong>정규직교 고유기저</strong>(Spectral Theorem)로 대각화한다.
5. 대칭이면서 $x^\top Px>0$인가? → <strong>Cholesky</strong>도 가능하다.

</details>

<details>

<summary>

<strong>추가정보 (교재 4.8 Further Reading 요약)</strong>

</summary>

- 고유분해는 <strong>spectral methods</strong>의 바탕이다. PCA(10장), Fisher discriminant analysis, MDS가 대표적이고, Isomap, Laplacian eigenmaps, Hessian eigenmaps, spectral clustering도 양의 정부호 커널의 고유분해에 기댄다.
- 이 방법들의 효율은 대칭 PSD 행렬의 <strong>최선의 rank-</strong>$k$<strong> 근사</strong>를 찾는 데서 나온다.
- Cholesky의 쓰임은 해당 노트의 “왜 필요한가”와 같다.
- SVD의 저차원 근사는 설계 행렬의 예측변수 상관을 없애는 전처리에도 쓰인다. (저장량은 행렬 근사 노트)

</details>

<details>

<summary>

<strong>이걸 모르면?</strong>

</summary>

- 어떤 행렬에 어떤 분해·연산이 가능한지 판단
- 5장 이후 최적화 · 6장 확률의 공분산 · 10장 PCA
- 이해 어려움

</details>

<div class="callout" role="note" data-kind="stuck">

<strong>막힐 가능성이 높은 지점</strong>

1. <strong>가역이라고 대각화가 되는 것은 아니다.</strong> 회전행렬이 반례이다. 반대로 대각화 가능해도 가역이 아닐 수 있다. (4.4)
1. <strong>대칭이면 정규이지만, 정규라고 대칭인 것은 아니다.</strong> 회전행렬은 정규지만 대칭이 아니다.
1. <strong>정규인지 확인하는 법.</strong> $A^\top A=AA^\top$을 직접 계산한다. 예 : $A=\begin{bmatrix}1&1\\0&1\end{bmatrix}$은 $A^\top A=\begin{bmatrix}1&1\\1&2\end{bmatrix}\neq AA^\top=\begin{bmatrix}2&1\\1&1\end{bmatrix}$이라 정규가 아니고, 고유벡터가 1개뿐인 defective이다. 회전행렬은 $R^\top R=RR^\top=I$라 정규(직교)이다.
1. <strong>SVD는 이 지도 전체에 적용된다.</strong> 다른 분해는 조건이 붙지만 SVD만 조건이 없다.

</div>

<div class="callout" role="note" data-kind="note">

<strong>풀린 것</strong> : 4장은 행렬을 “쪼개서” 이해하는 도구(det, 고유값, 분해, 근사)를 정리했다.

<strong>남은 것 → 5장</strong> : 행렬은 변환을 정적으로 본 것이다. 학습(최적화)에서 변화량을 재려면 미분이 필요하다. → 5장 Vector Calculus

</div>
