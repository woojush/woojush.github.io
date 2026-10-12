---
title: "Rank (예시)"
date: 2026-10-11
description: "행렬에서 선형독립인 열(행)의 최대 개수. 형식 확인용 예시 글"
topic: ai/mathematics/linear-algebra
status: growing
order: 1
tags: [linear-algebra]
---

<div class="callout" role="note" data-kind="intuition">

이 글은 DB 형식을 보여 주는 <strong>예시</strong>입니다. 내용을 지우고 직접 쓰거나, 이 페이지를 복제해서 쓰세요. 사이트에 올리려면 Publish를 체크합니다.

</div>

### 왜 필요한기요

행렬이 얼마나 많은 정보를 담고 있는지 하나의 숫자로 말하고 싶다.

### 정의

행렬 $A \in \mathbb{R}^{m \times n}$의 <strong>rank</strong>는 선형독립인 열벡터의 최대 개수이며, 선형독립인 행벡터의 최대 개수와 같다.

$$
\operatorname{rk}(A) = \dim \operatorname{span}\{a_1, \dots, a_n\}
$$

### 예시

<details>

<summary>

풀이 보기

</summary>

$A = \begin{pmatrix} 1 & 2 \\ 2 & 4 \end{pmatrix}$에서 둘째 열이 첫째 열의 2배이므로 $\operatorname{rk}(A)=1$이다.

</details>

```python
import numpy as np
np.linalg.matrix_rank(np.array([[1, 2], [2, 4]]))  # 1
```
