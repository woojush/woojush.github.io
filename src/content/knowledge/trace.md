---
title: "Trace"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/determinant-trace
status: seed
order: 3
---

> 정사각행렬의 <strong>대각 성분의 합</strong> $\text{tr}(A):=\sum_{i=1}^{n}a_{ii}$.
기저를 어떻게 잡아도 변하지 않는 숫자 중 하나이다. det가 곱셈 꼴의 요약(부피)이라면, trace는 덧셈 꼴의 요약이다.

<details>

<summary>

<strong>배경지식 (0에서 시작)</strong>

</summary>

<details>

<summary>

① 주대각선(main diagonal)

</summary>

> 정사각행렬에서 $a_{11},a_{22},\dots,a_{nn}$이 놓인 왼쪽 위에서 오른쪽 아래로의 대각선.

</details>

<details>

<summary>

② 닮음(similarity)과 기저변환 (2.7.2 복습)

</summary>

> 같은 선형사상 $\Phi:V\to V$를 기저만 바꿔 표현하면 행렬이 $A\to\tilde A=S^{-1}AS$로 바뀐다. 이런 두 행렬을 <strong>닮았다(similar)</strong> 고 한다.
이때 행렬의 <strong>성분은 전부 바뀐다.</strong>

</details>

<details>

<summary>

③ "기저에 의존하는 것" vs "선형사상 자체의 성질"

</summary>

> 행렬의 성분은 기저를 어떻게 잡았는가에 따라 달라지는 <strong>좌표 표현</strong>이다.
반면 기저를 바꿔도 변하지 않는 값은 행렬 한 장이 아니라 <strong>선형사상 자체</strong>가 가진 성질이다. (이런 값을 불변량이라 부른다.)

</details>

</details>

<details>

<summary>

<strong>왜 필요한가</strong>

</summary>

> 2장 Example 2.23의 $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$을 기저 $B=\big((1,1)^\top,(1,-1)^\top\big)$에서 보면 $\tilde A=\begin{bmatrix}3&0\\0&1\end{bmatrix}$가 된다.

| 기저 | 행렬 | det | tr |
| --- | --- | --- | --- |
| 표준기저 | $\begin{bmatrix}2&1\\1&2\end{bmatrix}$ | $3$ | $4$ |
| $B$ | $\begin{bmatrix}3&0\\0&1\end{bmatrix}$ | $3$ | $4$ |

> 성분은 전부 달라졌지만 det와 trace는 그대로이다. → 이 숫자들은 <strong>좌표가 아니라 선형사상 자체를 말해 준다.</strong>
4장의 첫 번째 목표(행렬을 몇 개의 숫자로 요약해서 성질을 한눈에 파악하기)에서 det와 trace가 그 숫자들이다.

</details>

<details>

<summary>

<strong>성질</strong>

</summary>

- $\text{tr}(A+B)=\text{tr}(A)+\text{tr}(B)$
- $\text{tr}(\alpha A)=\alpha\,\text{tr}(A)$  → 위 둘을 합치면 <strong>trace는 선형</strong>이다. (det와 다르다)
- $\text{tr}(I_n)=n$
- $\text{tr}(AB)=\text{tr}(BA)$  ($A\in\mathbb{R}^{n\times k},\;B\in\mathbb{R}^{k\times n}$)
- <strong>순환(cyclic) 불변성</strong> : $\text{tr}(AKL)=\text{tr}(KLA)$  ($A\in\mathbb{R}^{a\times k},K\in\mathbb{R}^{k\times l},L\in\mathbb{R}^{l\times a}$)
- 특수한 경우 : 벡터 $x,y\in\mathbb{R}^n$에 대해 $\text{tr}(xy^\top)=\text{tr}(y^\top x)=y^\top x$

</details>

<details>

<summary>

<strong>증명의 핵심 아이디어</strong>

</summary>

<details>

<summary>

$\text{tr}(AB)=\text{tr}(BA)$ : 이중합의 순서 바꾸기

</summary>

> $\text{tr}(AB)=\sum_{i=1}^{n}(AB)_{ii}=\sum_{i=1}^{n}\sum_{l=1}^{k}a_{il}b_{li}=\sum_{l=1}^{k}\sum_{i=1}^{n}b_{li}a_{il}=\sum_{l=1}^{k}(BA)_{ll}=\text{tr}(BA)$
같은 항들을 더하는 순서만 바꾼 것이다. $AB$는 $n\times n$, $BA$는 $k\times k$로 <strong>크기가 달라도</strong> 대각합은 같다.

</details>

<details>

<summary>

trace는 기저에 무관하다

</summary>

> 순환성을 $S^{-1}$와 $AS$에 적용하면
$\text{tr}(S^{-1}AS)=\text{tr}\big((S^{-1})(AS)\big)=\text{tr}\big((AS)(S^{-1})\big)=\text{tr}(A)$
따라서 선형사상 $\Phi$의 trace를 "아무 기저의 변환행렬의 trace"로 정의해도 기저 선택에 상관없이 같은 값이 나온다.

</details>

</details>

<details>

<summary>

<strong>예시</strong>

</summary>

<details>

<summary>

① 기저를 바꿔도 trace는 같다

</summary>

> 위 표 : $\text{tr}\begin{bmatrix}2&1\\1&2\end{bmatrix}=4,\;\;\text{tr}\begin{bmatrix}3&0\\0&1\end{bmatrix}=4$

</details>

<details>

<summary>

② $\text{tr}(xy^\top)=y^\top x$

</summary>

> $x=\begin{bmatrix}1\\2\end{bmatrix},\;y=\begin{bmatrix}3\\4\end{bmatrix}$이면 $xy^\top=\begin{bmatrix}3&4\\6&8\end{bmatrix}$이므로 $\text{tr}(xy^\top)=3+8=11$.
한편 $y^\top x=3\cdot1+4\cdot2=11$로 같다. (외적의 trace = 내적)

</details>

</details>

<details>

<summary>

<strong>이걸 모르면?</strong>

</summary>

- 닮음 · 기저변환에서의 불변량 개념
- 특성다항식의 계수 (바로 다음 노트)
- 고유값의 합과의 관계 (4.2 이후)
- 행렬 미분 (5장)
- 이해 어려움

</details>

<details>

<summary>

<strong>추가정보</strong>

</summary>

- 교재는 "덧셈 보존, 스칼라 곱 보존, $\text{tr}(I_n)=n$, $\text{tr}(AB)=\text{tr}(BA)$ 네 성질을 모두 만족하는 함수는 trace 하나뿐"이라고 소개한다.

</details>

<div class="callout" role="note" data-kind="stuck">

<strong>막힐 가능성이 높은 지점</strong>

1. $AB\neq BA$<strong>인데 </strong>$\text{tr}(AB)=\text{tr}(BA)$<strong>.</strong> 두 행렬이 같다는 뜻이 아니라 <strong>대각합만</strong> 같다는 뜻이다.
1. <strong>순환 순서만 허용된다.</strong> $\text{tr}(ABC)=\text{tr}(BCA)=\text{tr}(CAB)$이지만 $\text{tr}(ACB)$와는 일반적으로 다르다.
1. $\text{tr}(AB)\neq\text{tr}(A)\text{tr}(B)$<strong>.</strong> det는 곱을 보존하지만 trace는 곱을 보존하지 않는다.
1. "대각 성분 하나하나는 기저에 따라 바뀌는데 합은 안 바뀐다"가 어색하게 느껴진다. → 증명은 위 순환성 한 줄이 전부이다.

</div>
