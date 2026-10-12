---
title: "Symmetric Positive Definite Matrices"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/inner-product-spaces
status: seed
order: 3
---

>
>
> 1. <strong>추상적인 벡터공간에서 정의된 Inner Product를, 어떤 좌표계(기저)에서 행렬 계산으로 표현한 것.</strong>
> 1. $\R^n$에서의 내적, dot product의 한계를 보완하기 위해 필요한 개념.
>    <details>
>
>    <summary>
>
>    $\text{Dot Product}$는 동일한 가치를 가정한다.
>
>    </summary>
>
>    > 기본 내적 $x^\top y$는 공간의 모든 방향이 대등하고 균일하다는 등방성(Isotropy)을 가정한 특별한 케이스이다,

• <strong>단위와 중요도가 다른 경우:</strong>
어떤 데이터가 `(키(cm), 소득(만원))` 형태의 벡터라고 해보자.
>    >
>    > $x = (180, 5000)$,    $y = (181, 5000)$
키가 1cm 차이 나는 두 사람의 거리를 기본 내적으로 구하면 거리는 1이 된다.
 그런데 만약 소득이 1만원 차이 나는 경우인 $z = (180, 5001)$과의 거리를 구해도 똑같이 1이 된다
>    >
>    > 기본 내적 관점에서는 "키 1cm 차이 = 소득 1만원 차이"를 동일한 거리의 변화로 취급해 버리는 것이다.
이때 중간에 행렬 $A$를 넣으면, "키 1cm의 차이는 가중치를 작게 주고, 소득 1만원의 차이는 가중치를 더 크게 주겠다"는 식의 <strong>맞춤형 자(Metric)</strong>를 만들 수 있다.
>
>    </details>
>
>    <details>
>
>    <summary>
>
>    $x^\top A y$는 공간을 뒤틀어 가치를 다르게 설정한다.
>
>    </summary>
>
>    > 변환된 공간에서 눈으로 볼 때(기본 직교좌표계) 두 화살표 $x$와 $y$의 사이각이 60도나 120도로 보이더라도,
$x^\top A y = 0$이라면
"이 데이터/시스템이 가진 <strong>왜곡된 가치 체계 내에서는 두 벡터가 서로 전혀 간섭하지 않는 독립적인 상태</strong>"에 있음을 의미한다.
>
>    </details>
>
> <details>
>
> <summary>
>
> $x^\top A y$는 다시 일반적인 내적의 형태, $z^{\top}w$로 전환된다.
>
> </summary>
>
> > $A=A^{1/2}A^{1/2}$이므로, $\begin{cases} z=A^{1/2}x \\ w=A^{1/2}y \end{cases}$ 으로 두면 ($A^{1/2}$ 는 대칭) $x^\top Ay=(A^{1/2}x)^\top(A^{1/2}y)=z^\top w$ 이다.
즉, 왜곡된 공간에서 $x^\top Ay$ 라는 복잡한 자(Metric)를 쓰며 계산하는 대신, 벡터 자체에 $A^{1/2}$ 변환을 먼저 가하면 <strong>새로운 공간에서는 기본 내적 </strong>$z^\top w$<strong> 만 써도 정확하게 똑같은 결과</strong>가 나온다.
>
> </details>

<details>

<summary>

$<x,y>=\hat x^T A\hat y$   ※여기서 A가 SPD면 내적의 조건을 만족.

</summary>

- $x,y$ : 원래 vector space의 vector
- $\hat x,\,\hat y$ : 선택한 기저에 대한 좌표벡터
  > <strong>"어떤 벡터를 내가 선택한 기저의 선형결합으로 나타냈을 때, 그 앞에 붙는 계수들을 모아놓은 벡터"</strong>
  >
  > ex) 벡터공간의 기저 $\text{B}=\{b_1, b_2, b_3\}$에 대해, 어떤 벡터 $x=2b_1-3b_2+5b_3$로 표현된다면, $\hat x = \begin{bmatrix}2\\-3\\5\end{bmatrix}$
즉, $\hat x=[x]_B$
- $A$ : 해당 Inner Product의 구조를 담은 행렬

</details>

<details>

<summary>

<strong>벡터가 함수인 경우는.. A를 어떻게 알아내는가</strong>

</summary>

<div class="callout" role="note" data-kind="intuition">

똑같은 원리이다. 
다만 함수공간에서는 “기저”가 숫자 벡터가 아니라 함수들의 지밥이 되는 것.
예를 들어 벡터공간 $\text{V}=\text{P}_2$ 즉, 2차 이하 다항식들의 공간이라고 해보자.
기저를 $B=\{1, x,x^2\}$으로 선택하면 함수 $f(x)=3-2x+5x^2$도 이 공간의 벡터이다.

왜? ⇒ $3(1) + (-2)x + 5(x^2)$로 기저함수들의 선형결합으로 $f(x)$를 표현할 수 있기 때문.
따라서 이러한 경우 $\hat f=\begin{bmatrix}3\\-2\\5\end{bmatrix}$

+) 기저가 $B=\{1+x, x+x^2,1-x^2\}$일지라도 충분히 가능.

$f(x) =a(1+x)+b(x+x^2)+c(1-x^2)$이 되도록 $a,b,c$를 구하면 된다.

</div>

</details>

<details>

<summary>

<strong>수식적 이해</strong>

</summary>

> $<x,y>$를 $\hat x^TA\hat y$꼴로 표현하기 위해서는, 먼저 추상적인 벡터 $x,y$를 좌표 벡터로 표현하는 과정이 필요하다.
>
> 벡터는 반드시 숫자 배열일 필요가 없고, 함수·다항식·행렬 등 일수도 있기 때문이다.
>
> 따라서 x, y가 속한 벡터공간에서 하나의 기저 $B$를 선택하고, x, y를 그 기저의 선형결합으로 표현한다.

- 기저 $\text{B}=(b_1, b_2,..., b_n)$
- 벡터 $x=\Psi_1b_1+\Psi_2b_2+...+\Psi_nb_n = \sum_{i=1}^n\Psi_ib_i, \,\,\,\, y=\sum_{j=1}^n\lambda_jb_j$     ※기저에 의해 좌표화된 벡터 x, y의 모습
- 좌표벡터 $\hat x=\begin{pmatrix} \Psi_1\\\Psi_2\\⋮\\\Psi_n\end{pmatrix},\,\,\,\,\hat y=\begin{pmatrix} \lambda_1\\\lambda_2\\⋮\\\lambda_n\end{pmatrix}$

> $<x,y>$에서 $x=<\sum_{i=1}^n \Psi_ib_i,\,\, y>$이다.
여기서 Inner Product는 선형성을 만족해야만 한다는 조건을 활용,

>
>
> $<\Psi_1b_1+\Psi_2b_2+...+\Psi_nb_n, \,\,y>=\Psi_1<b_1,y>+\Psi_2<b_2,y>+...+\Psi_n<b_n,y>$
>
> 즉, $<x,y>=\sum_{i=1}^n\Psi_i<b_i, \,\,y>$이다. 
>
> 여기서 $y=\sum_{j=1}^n\lambda_jb_j$를 이용하여, $<x,y>=\sum_{i=1}^n\Psi_i<b_i, \,\,\sum_{j=1}^n\lambda_jb_j>$
>
> Inner Product의 선형성을 다시 이용, $<b_i, \,\,\sum_{j=1}^n\lambda_jb_j>=\sum_{j=1}^n\lambda_j<b_i,b_j>$이므로
>
> $<x,y>=\sum_{i=1}^n\sum_{j=1}^n\Psi_i\lambda_j<b_i,b_j>$이다.

</details>

<details>

<summary>

<strong>행렬의 곱을 통한 직관적 증명</strong>

</summary>

> $n=2$를 가정해보자. $\sum_{i=1}^2\sum_{j=1}^2\Psi_i\lambda_j<b_i,b_j>$
>
> ⇒ 표에 나오는 결과 4가지를 모두 더한 것이 바로 이중합의 결과이다.
>
> | i | j | 결과 |
> | --- | --- | --- |
> | 1 | 1 | Ψ₁λ₁⟨b₁, b₁⟩ |
> | 1 | 2 | Ψ₁λ₂⟨b₁, b₂⟩ |
> | 2 | 1 | Ψ₂λ₁⟨b₂, b₁⟩ |
> | 2 | 2 | Ψ₂λ₂⟨b₂, b₂⟩ |

> ★ 행렬곱은 이 이중합을 간결하게 표현하는 방법이다.

$[\Psi_1\,\,\Psi_2]\begin{bmatrix}<b_1, b_1>&<b_1, b_2>\\<b_2, b_1> &<b_2, b_2>\end{bmatrix}\begin{bmatrix}\lambda_1\\\lambda_2\end{bmatrix}$를 풀어서 계산해보면 실제로 이중합과 값이 같음을 알 수 있으며, $A_{ij}=<b_i,b_j>$라 한다면 

$[\Psi_1\,\,\Psi_2]\begin{bmatrix}<b_1, b_1>&<b_1, b_2>\\<b_2, b_1> &<b_2, b_2>\end{bmatrix}\begin{bmatrix}\lambda_1\\\lambda_2\end{bmatrix}=\hat x^TA\hat y$와 같으므로, $<x,y>=\sum_{i=1}^n\sum_{j=1}^n\Psi_i\lambda_j<b_i,b_j>=\hat x^TA\hat y$이다.

※ A는 symmetric이다. 내적의 대칭성에 의해 $<b_i,b_j>=<b_j,b_i>$이므로 $A_{ij}=A_{ji}$이며, $A=A^T$이다.

</details>

<details>

<summary>

<strong>행렬 A에 대한 직관</strong>

</summary>

<details>

<summary>

① A는 무엇인가?

</summary>

> $A_{ij}=<b_i,b_j>$ 즉, $A=\begin{pmatrix}\langle b_1,b_1\rangle&\cdots&\langle b_1,b_n\rangle\\ \vdots&\ddots&\vdots\\ \langle b_n,b_1\rangle&\cdots&\langle b_n,b_n\rangle\end{pmatrix}$ (Gram 행렬)

</details>

<details>

<summary>

② 대각 원소에는 무엇이 들어있는가?

</summary>

> $A_{ii}=<b_i,b_i>=||b_i||^2$ 따라서 <strong>“대각원소 → 각 기저벡터의 길이의 제곱”</strong>

</details>

<details>

<summary>

③ 비대각 원소에는 무엇이 들어있는가?

</summary>

> $A_{ij}=<b_i,b_j>=||b_i||\,\,||b_j||cos(\theta_{ij}) \,\,\,(i\neq j)$
따라서 “비대각 원소 → 두 기저벡터의 크기와 서로의 방향 관게를 담고 있는 정보”이다.
기저벡터의 길이를 알고 있으면 이 값으로 두 벡터 사이의 각도도 알아낼 수 있다.
>
> 특히 $A_{ij}=0$이면 $b_i\perp b_j$이다.

</details>

<details>

<summary>

④ 그러면 $\hat x^TA\hat y$에서는 어떻게 사용되는가?

</summary>

> $x=\sum_{i=1}^nx_ib_i,\,\,y=\sum_{j=1}^ny_jb_j$라 하자.
>
> 그러면 $<x,y>=\sum_{i=1}^n\sum_{j=1}^n x_i <b_i, b_j>y_j$가 된다.
>
> 즉, $\hat x$와 $\hat y$는 각각 x, y가 각 기저를 얼마나 사용하는지를 나타내고,
A는 그 기저벡터들이 서로 어떤 inner product 관계를 갖는지 알려준다.

</details>

<details>

<summary>

<strong>추가정보</strong>

</summary>

> 기저 B가 orthonormal basis이면 $A=I$이므로 $<x,y>=\hat x^T \hat y$꼴 즉, Dot product이다.
>
> 여기서 $A=I$일 때가 표준기저벡터일 때라고 국한지어 생각하지 않도록 하자.
기저벡터들의 길이가 1이고 나머지가 0. 즉, $\perp$라는 건 표준기저벡터 말고도 존재한다.

</details>

</details>

<details>

<summary>

<strong>SPD와 Inner Product의 관계</strong>

</summary>

> 주어긴 기저 B에 대해 $<x,y>=\hat x^T A \hat y$로 Inner Product를 표현할 때, 행렬 A는 반드시 Symmetric Positive Definite, SPD여야한다.
반대로 A가 SPD이면 위 식은 Inner Product를 정의한다.
>
> 즉, $<x,y>$가 $\text{Inner Product} \Leftrightarrow A가 SPD$

</details>

<details>

<summary>

<strong>Inner Product의 조건은 A에서 어떻게 나타나는가?</strong>

</summary>

- Bilinearity : $<x,y>=\hat x^T A \hat y$의 형태에서 행렬곱의 선형성에 의해 만족된다.
- Symmetric : $A=A^T$이면 symmetric이다.
- Positive Definite : $x \neq 0 \rightarrow \text{<x,x>}>0$ $\Rightarrow \hat x\neq 0 \rightarrow \hat x^TA \hat x >0$

</details>

<details>

<summary>

<strong>문제</strong>

</summary>

[Untitled](https://app.notion.com/p/3ee09d87213b80e89ff9d0ade859b6c3)

[Untitled](https://app.notion.com/p/3ee09d87213b80de9aa5ddc4c5c3af0c)

</details>
