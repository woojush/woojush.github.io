---
title: "Norm"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/inner-product-spaces
status: seed
order: 1
---

> $\text{Norm} \begin{cases} \text{Euclidean Norm}\\ \text{Manhattan Norm} \end{cases}$         ※ Norm은 정의하기 나름이며, 해당 두가지는 $R^n$차원에서 정의된 대표적인 Norm이다.

<details>

<summary><strong>왜 Norm이 필요한가?</strong></summary>

> 벡터 $x=(x_1, x_2,...,x_n)$이 있을 때 “이 벡터 얼마나 크지?”, “이 두 벡터 서로 얼마나 떨어져있지?” 하는 질문이 필요한 순간이 있다.
>
> 숫자가 하나라면 크기 비교가 쉽지만 벡터는 n개의 숫자 뭉치이다.
”<strong>이 여러 숫자를 어떻게 하나의 대표값(크기)으로 압축할 것인가</strong>”에서 Norm의 방식이 나뉜다.

</details>

<details>

<summary><strong>Euclidean Norm </strong></summary>

> 피타고라스 정리를 2차원, 3차원을 넘어서 n차원으로 그대로 일반화한 것.
>
> $\sqrt{\sum_{i=1}^{n} x_i^2} = \sqrt{x^Tx}$              \*$||x||_2 \,\, \text{or} \,\,l_2$로 표기

</details>

<details>

<summary><strong>Manhattan Norm</strong></summary>

\*뉴욕 맨하튼 도로는 전부 격자 모양이라 건물을 뚫고 대각선으로 갈 수 없음.
오로지 도로를 따라서 직각 이동.

>
>
> 각 좌표의 절댓값을 모두 더한 것.
>
> $||\bm{x}||_1=|x_1|+|x_2|+...+|x_n|$
>
> 가령 $[0,0]$에서 $[3,4]$로 가는 벡터의 $||x||_1=7$       \*$||x||_1 \,\, \text{or} \,\,l_1$로 표기

<div class="callout" role="note" data-kind="intuition">

<strong>Euclidean Norm이 있는데 왜 또 다른 Norm을 정의하냐!</strong>

→ <strong>Norm은 벡터의 크기를 정의하는 방법이며, 하나로 고정되어 있지 않다.</strong>

Euclidean Norm은 우리가 익숙한 유클리드 기하학의 거리 개념을 반영하지만, 문제의 목적이나 공간의 구조에 따라 다른 방식으로 크기와 거리를 정의할 수 있다.

따라서 <strong>같은 벡터라도 어떤 Norm을 선택하느냐에 따라 그 크기와 거리의 값이 달라질 수 있다.</strong>

</div>

<details>

<summary><strong>manhattan norm은 왜 필요함?</strong></summary>

> 모델에게 붙는 가중치를 조정할 때, Euclidean을 활용하면 가중치가 0.x 꼴인 경우 제곱하면 값이 더 작아져서 굳이 신경 쓰지도 않음. 그런데 Manhattan은 절댓값으로 곧이곧대로 받아들여서, 차라리 어설프게 남겨두지 말고 0으로 만들자! 하게 됨.

</details>

</details>

<details>

<summary>조건</summary>

>
>
> $\Vert x\Vert\ge0$, $\Vert x\Vert=0\iff x=0$, $\Vert\alpha x\Vert=|\alpha|\,\Vert x\Vert$

</details>
