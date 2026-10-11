---
title: "Rotation"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/orthogonality-projection
status: seed
order: 6
---

<details>

<summary><strong>1. Column Vectors와 Linear Transformation</strong></summary>

> 선형변환 $T$가 있을 때 이를 나타내는 행렬 $A$의 각 column은 사실 $T(e_i)$, 즉 <strong>표준기저벡터가 이동한 결과</strong>이다.
>
> 따라서 행렬 전체의 숫자 배열을 보는 대신 "각 표준기저벡터가 선형변환 후 어디로 이동했는가"를 보면 그 선형변환의 구조를 훨씬 직관적으로 파악할 수 있다.
>
> 이 관점은 뒤에서 다룰 Rotation을 이해하는 데에도 그대로 이어진다.
<strong>Rotation 역시 "표준기저벡터들이 어디로 회전해서 이동하는가"로 이해할 수 있는 하나의 선형변환이기 때문이다.</strong>

<details>

<summary><strong>왜 열벡터가 곳 기저벡터의 이동인가</strong></summary>


</details>

</details>

<details>

<summary><strong>2. Rotation은 무엇을 보존하는가?</strong></summary>

> Rotation은 표준기저벡터의 <strong>방향</strong>을 바꾸지만, <strong>길이와 각도는 보존</strong>한다.
즉 $\Vert{}T(e_i)\Vert{}=1$이고 $T(e_i)\perp T(e_j)\,\,(i\neq j)$이므로, 회전된 기저벡터들 $T(e_1),\dots,T(e_n)$ 역시 원래의 표준기저처럼 <strong>orthonormal</strong>하다.

<details>

<summary><strong>왜 길이·각도가 보존되면 Orthogonal Matrix인가</strong></summary>

> Rotation matrix $R$의 column들이 orthonormal하다는 것은 정확히 $R^\top R=I$를 만족한다는 것과 같다.
그리고 $R^\top R=I$이면 임의의 $x,y$에 대해

$$
\Vert{}Rx\Vert{}=\Vert{}x\Vert{},\,\,\,\,\,\,\,\,\,\,\,\,\,\ \langle Rx, Ry \rangle = (Rx)^\top (Ry) = x^\top (R^\top R) y = x^\top I y = x^\top y
$$

> 가 성립한다. 즉 <strong>회전 전후로 벡터의 길이와 두 벡터 사이의 각도가 그대로 유지</strong>된다.

</details>

<details>

<summary><strong>참고: Orthogonal Matrix 전체가 Rotation은 아니다</strong></summary>

\*orthogonal matrix는 열벡터가 orthonormal인 matrix를 말한다. (orthogonal만으로는 만족 x)

> Orthogonal matrix는 $R^\top R=I$를 만족하는 행렬 전체를 말하며, 이 조건만으로는 $\det R=\pm1$이 가능하다.    
이 중 $\det R=+1$인 경우만 방향을 보존하는 <strong>proper rotation</strong>이고, $\det R=-1$인 경우는 reflection(반사)이다.
>
> 즉 rotation matrix는 orthogonal matrix의 부분집합이다.

<details>

<summary><strong>행렬식, determinant의 의미</strong></summary>

<details>

<summary><strong>1. 2차원 공간: 면적 변화율</strong></summary>

> 행렬식(Determinant, $\det(A)$)의 기하학적 의미는 선형변환을 거쳐을 때 공간(면적이나 부피)이 몇 배로 확대 또는 축소되는지를 나타내는 변화율이다.
>
> 이 두 이동된 열벡터가 만드는 <strong>평행사변형의 넓이</strong>가 바로 행렬식의 절대값 $\vert{}\det(A)\vert{}$이다.

</details>

<details>

<summary><strong>2. 행렬식 부호(</strong>$\pm$<strong>)의 의미: 공간의 방향성</strong></summary>

> 행렬식 값은 음수가 될 수도 있다. 부호는 <strong>공간이 거울처럼 뒤집혔는지 여부</strong>를 나타낸다.
>
> - $\det(A) > 0$ (양수): 공간의 방향성이 유지된다.
$e_1$에서 $e_2$로 향하는 반시계방향 관계가 변환 후 $Ae_1$에서 $Ae_2$로 향할 때도 그대로 반시계방향으로 유지된다.
> - $\det(A) < 0$ (음수): 공간이 종이처럼 반대로 <strong>뒤집힌다</strong>. $Ae_1$과 $Ae_2$의 시계/반시계 순서 관계가 역전된다.

</details>

<details>

<summary><strong>3. </strong>$\det(A) = 0$<strong>의 의미: 차원 축소</strong></summary>

> 행렬식이 $0$이라는 것은 <strong>변환 후 면적(또는 부피)이 </strong>$0$<strong>으로 납작하게 압축되었다</strong>는 뜻이다.

</details>

</details>

</details>

</details>

<details>

<summary><strong>3. Rotation Axis</strong></summary>

> 3D rotation에서는 특정 축을 고정한 채, 나머지 2차원 평면 안에서만 회전이 일어나는 경우가 많다.
예를 들어 $e_1$을 회전축으로 고정하면 $T(e_1)=e_1$이므로, 행렬의 첫 번째 column은

$$
\begin{bmatrix}1\\0\\0\end{bmatrix}
$$

> 로 그대로 유지된다. 반면 $e_2, e_3$는 $e_1$을 축으로 하는 평면($y$-$z$ 평면) 안에서 서로의 방향으로 회전해 들어간다.

<details>

<summary><strong>x축 회전행렬</strong></summary>

> "첫 번째 축은 고정하고, 나머지 2차원 평면에서만 회전이 일어난다"는 구조를 그대로 행렬로 옮기면 다음과 같다.

$$
R_x(\theta)=\begin{bmatrix}1&0&0\\0&\cos\theta&-\sin\theta\\0&\sin\theta&\cos\theta\end{bmatrix}
$$

> 첫 번째 column이 $e_1$ 그대로이고, 나머지 $2\times2$ 블록이 $y,z$ 평면 위에서의 2D rotation(4 참고)과 똑같은 구조인 것을 알 수 있다.
>
> \*x축을 회전축으로 잡으면, 실제 회전은 $yz$ 평면에서 일어나고, $\theta$ 는  $yz$ 평면에서  $+y$ 방향을 기준으로 측정하는 회전각이다.

<strong>일반적인 축</strong>(단위벡터 $n=(n_1,n_2,n_3)$)에 대한 회전으로 확장하면 <strong>Rodrigues' Rotation Formula</strong>를 얻는다.
$R = I + \sin\theta\,[n]_\times + (1-\cos\theta)[n]_\times^2,\quad [n]_\times=\begin{bmatrix}0&-n_3&n_2\\n_3&0&-n_1\\-n_2&n_1&0\end{bmatrix}$
($[n]_\times$는 외적 $n\times v$를 행렬곱 $[n]_\times v$로 표현한 skew-symmetric 행렬이다.) 위에서 본 $R_x(\theta)$는 $n=e_1$인 특수한 경우일 뿐이다.
사실 3D의 모든 rotation은 반드시 어떤 고정된 축을 가진다는 것이 <strong>Euler's Rotation Theorem</strong>이며, 그 축은 $Rv=v$를 만족하는 방향 $v$이다 (고유값 1을 갖는 고유벡터 — 추후 고유값 파트에서 다시 만나게 될 개념).
OpenCV의 `cv2.Rodrigues()`나 로보틱스의 axis-angle 표현은 이 공식을 그대로 사용한 것이며, SLAM·Bundle Adjustment에서 회전을 최적화할 때도 $R$을 직접 더하지 않고 이 축-각 파라미터화($\mathfrak{so}(3)$ Lie algebra)로 미소 변화를 다루는 것이 표준 방식이다.

</details>

</details>

<details>

<summary><strong>4. 왜 sin, cos인가?</strong></summary>

> 회전 후에도 단위벡터의 길이는 여전히 1이므로, 회전된 단위벡터는 항상 <strong>단위원 위</strong>에 존재한다.
단위원 위에서 각도 $\theta$만큼 회전한 점의 좌표는 $(\cos\theta,\sin\theta)$로 표현되므로, 회전행렬의 column에 자연스럽게 $\sin,\cos$가 등장하게 된다.

<details>

<summary><strong>Column Vector 관점에서 다시 보기</strong></summary>

> 1번 항목에서 본 것처럼 행렬의 첫 번째 column은 $T(e_1)$, 즉 회전된 $e_1$이다.

$$
R(\theta)=\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix},\qquad R(\theta)e_1=\begin{bmatrix}\cos\theta\\\sin\theta\end{bmatrix}
$$

> 즉 $R(\theta)e_1$이 정확히 단위원 위에서 각도 $\theta$만큼 회전한 점의 좌표이며, 이것이 곧 행렬의 첫 번째 column이다.
이렇게 보면 $\sin,\cos$는 암기해야 할 공식이 아니라 "<strong>회전된 기저벡터가 단위원 위 어디에 있는가</strong>"를 좌표로 나타낸 결과일 뿐이다.

</details>

</details>

<details>

<summary><strong>5. Rotation Composition</strong></summary>

> 여러 번의 회전을 연속으로 적용했을 때, 그 순서가 결과에 영향을 주는지는 <strong>차원과 회전축</strong>에 따라 달라진다.

<details>

<summary><strong>2D: 항상 교환 가능하다</strong></summary>

>
>
> 2D에서 회전은 사실상 하나의 회전축을 공유한다.
>
> 따라서 두 회전 $R(\theta)$, $R(\phi)$를 연속으로 적용하면 $R(\phi)R(\theta) = R(\theta+\phi)$
>
> 즉, $\boxed{\text{2D에서는 회전 순서를 바꾸어도 결과가 같다.}}$
>
> 직관적으로:
• 먼저 40° 회전 후 70° 회전
• 먼저 70° 회전 후 40° 회전
• 둘 다 결국 총 110° 회전

</details>

<details>

<summary><strong>3D+: 교환 불가능하다</strong></summary>

>
>
> 3D에서는 서로 다른 회전축을 선택할 수 있다.   ex. $R_x(\alpha), \,\,R_y(\beta)$
>
> 이 두 회전을 연속으로 적용하면 일반적으로   $\boxed{R_x(\alpha)R_y(\beta) \neq R_y(\beta)R_x(\alpha)}$
>
> - 핵심은 첫 번째 회전이 벡터의 상태를 바꾸고, 두 번째 회전은 그 바뀐 벡터에 적용된다는 것이다.
> - 회전축이 다르기 때문에 두 회전의 효과가 서로 단순히 더해지지 않는다.

</details>

<details>

<summary><strong>인터랙티브 그래픽</strong></summary>


</details>

</details>

<details>

<summary><strong>AI Engineering Relevance</strong></summary>

<div class="callout" role="note" data-kind="intuition">

<strong>왜 AI 엔지니어가 이 개념을 알아야 하는가?</strong>

<strong>현실 세계의 물리 법칙 보존 (Isometry)</strong>
    ◦ 물체를 회전시켜도 실제 크기나 형태(거리·각도)가 왜곡되면 안 된다.
    ◦ $R^\top R = I$  조건 덕분에 3D Graphics, Robotics(로봇 관절), Computer Vision(카메라 Pose / SLAM / NeRF)에서 물체를 찌그러뜨리지 않고 안정적으로 <strong>강체 변환</strong>(Rigid Body Motion)을 수행할 수 있다.

</div>

</details>

<details>

<summary><strong>문제</strong></summary>

[Untitled](https://app.notion.com/p/3f009d87213b8002a18eecaf615b7ec8)

</details>
